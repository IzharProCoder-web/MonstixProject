import Message from "../Model/Message.js";

export const sendMessage = async (req, res) => {
  try {
    const { receiverId, text } = req.body;
    const senderId = req.user.userId;

    if (!receiverId || !text) {
      return res.status(400).json({ success: false, message: 'Receiver ID and message text are required' });
    }

    const message = new Message({
      sender: senderId,
      receiver: receiverId,
      text,
    });

    await message.save();
    
    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'username email')
      .populate('receiver', 'username email');

    // Emit to both sender and receiver
    const io = req.app.get('io');
    io.emit('new_message', populatedMessage);

    res.status(200).json({ success: true, message: 'Message sent successfully', data: populatedMessage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { userId } = req.params;
    const loggedInUserId = req.user.userId;

    const messages = await Message.find({
      $or: [
        { sender: loggedInUserId, receiver: userId },
        { sender: userId, receiver: loggedInUserId },
      ],
      isDeleted: false,
    })
      .populate('sender', 'username email')
      .populate('receiver', 'username email')
      .sort({ timestamp: 1 });

    // Mark messages as seen when fetched
    await Message.updateMany(
      {
        sender: userId,
        receiver: loggedInUserId,
        seen: false
      },
      { 
        seen: true, 
        seenAt: new Date() 
      }
    );

    // Emit seen event
    const io = req.app.get('io');
    io.emit('messages_seen', {
      senderId: userId,
      receiverId: loggedInUserId
    });

    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const editMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { text } = req.body;
    const userId = req.user.userId;

    if (!text) {
      return res.status(400).json({ success: false, message: 'Message text is required' });
    }

    const message = await Message.findOne({ _id: messageId, sender: userId, isDeleted: false });

    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    message.text = text;
    message.edited = true;
    message.editedAt = new Date();

    await message.save();

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'username email')
      .populate('receiver', 'username email');

    const io = req.app.get('io');
    io.emit('message_edited', populatedMessage);

    res.status(200).json({ success: true, message: 'Message updated successfully', data: populatedMessage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.userId;

    const message = await Message.findOne({ _id: messageId, sender: userId });

    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    message.isDeleted = true;
    await message.save();

    const io = req.app.get('io');
    io.emit('message_deleted', { 
      messageId: messageId,
      deletedFor: userId 
    });

    res.status(200).json({ success: true, message: 'Message deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get unseen messages count
export const getUnseenCount = async (req, res) => {
  try {
    const userId = req.user.userId;

    const unseenCount = await Message.countDocuments({
      receiver: userId,
      seen: false,
      isDeleted: false
    });

    res.status(200).json({ success: true, data: { unseenCount } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};