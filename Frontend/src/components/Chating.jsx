/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import io from "socket.io-client";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Chating = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState({});
  const [typingUsers, setTypingUsers] = useState({});
  const [socket, setSocket] = useState(null);
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null);
  const [editText, setEditText] = useState("");
  const [unseenCounts, setUnseenCounts] = useState({});
  const chatContainerRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const editInputRef = useRef(null);

  useEffect(() => {
    const newSocket = io(BACKEND_URL, {
      withCredentials: true,
    });
    
    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message) => {
      setChatHistory(prev => {
        const otherUserId = message.sender._id === loggedInUserId ? message.receiver._id : message.sender._id;
        const existingMessages = prev[otherUserId] || [];
        
        const messageExists = existingMessages.some(msg => msg._id === message._id);
        if (messageExists) return prev;

        const newMessage = {
          _id: message._id,
          sender: message.sender._id === loggedInUserId ? "me" : "other",
          text: message.text,
          timestamp: message.timestamp,
          seen: message.seen,
          edited: message.edited,
          isDeleted: message.isDeleted
        };

        return {
          ...prev,
          [otherUserId]: [...existingMessages, newMessage]
        };
      });

      if (message.receiver._id === loggedInUserId && !message.seen) {
        setUnseenCounts(prev => ({
          ...prev,
          [message.sender._id]: (prev[message.sender._id] || 0) + 1
        }));
      }

      if (selectedUser && selectedUser._id === message.sender._id) {
        markMessagesAsSeen(selectedUser._id);
      }
    };

    const handleMessageEdited = (message) => {
      setChatHistory(prev => {
        const otherUserId = message.sender._id === loggedInUserId ? message.receiver._id : message.sender._id;
        const existingMessages = prev[otherUserId] || [];
        
        const updatedMessages = existingMessages.map(msg => 
          msg._id === message._id ? {
            ...msg,
            text: message.text,
            edited: true,
            editedAt: message.editedAt
          } : msg
        );
        
        return {
          ...prev,
          [otherUserId]: updatedMessages
        };
      });
    };

    const handleMessageDeleted = (data) => {
      setChatHistory(prev => {
        const updatedHistory = { ...prev };
        Object.keys(updatedHistory).forEach(userId => {
          updatedHistory[userId] = updatedHistory[userId].filter(msg => 
            msg._id !== data.messageId
          );
        });
        return updatedHistory;
      });
    };

    const handleUserTyping = (data) => {
      setTypingUsers(prev => ({
        ...prev,
        [data.senderId]: data.isTyping
      }));
    };

    const handleMessagesSeen = (data) => {
      if (data.receiverId === loggedInUserId) {
        setChatHistory(prev => {
          const existingMessages = prev[data.senderId] || [];
          const updatedMessages = existingMessages.map(msg => 
            msg.sender === "me" ? { ...msg, seen: true } : msg
          );
          
          setUnseenCounts(prev => ({
            ...prev,
            [data.senderId]: 0
          }));
          
          return {
            ...prev,
            [data.senderId]: updatedMessages
          };
        });
      }
    };

    socket.on('new_message', handleNewMessage);
    socket.on('message_edited', handleMessageEdited);
    socket.on('message_deleted', handleMessageDeleted);
    socket.on('user_typing', handleUserTyping);
    socket.on('messages_seen', handleMessagesSeen);

    return () => {
      socket.off('new_message', handleNewMessage);
      socket.off('message_edited', handleMessageEdited);
      socket.off('message_deleted', handleMessageDeleted);
      socket.off('user_typing', handleUserTyping);
      socket.off('messages_seen', handleMessagesSeen);
    };
  }, [socket, loggedInUserId, selectedUser]);

  // Focus on edit input when editing starts
  useEffect(() => {
    if (editingMessage && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingMessage]);

  const totalUser = async () => {
    try {
      const { data } = await axios.get(`${BACKEND_URL}/api/user/get-users`, {
        withCredentials: true,
      });
      if (data.success) {
        setLoggedInUserId(data.loggedInUserId);
        const filteredUsers = data.users.filter(user => user._id !== data.loggedInUserId);
        setUsers(filteredUsers);
        
        if (socket) {
          socket.emit('user_connected', data.loggedInUserId);
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const fetchMessages = async (userId) => {
    try {
      const { data } = await axios.get(`${BACKEND_URL}/api/message/get/${userId}`, {
        withCredentials: true,
      });
      if (data.success) {
        setChatHistory((prev) => ({
          ...prev,
          [userId]: data.data.map((msg) => ({
            _id: msg._id,
            sender: msg.sender._id === loggedInUserId ? "me" : "other",
            text: msg.text,
            timestamp: msg.timestamp,
            seen: msg.seen,
            edited: msg.edited,
            isDeleted: msg.isDeleted
          })),
        }));

        const unseenFromUser = data.data.filter(msg => 
          msg.sender._id === userId && !msg.seen
        ).length;
        
        setUnseenCounts(prev => ({
          ...prev,
          [userId]: unseenFromUser
        }));
        
        markMessagesAsSeen(userId);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const markMessagesAsSeen = (senderId) => {
    if (socket && loggedInUserId && senderId) {
      socket.emit('message_seen', {
        senderId: senderId,
        receiverId: loggedInUserId
      });
      
      setUnseenCounts(prev => ({
        ...prev,
        [senderId]: 0
      }));
    }
  };

  const sendMessage = async (receiverId) => {
    if (!message.trim()) {
      toast.error("Message cannot be empty");
      return;
    }
    try {
      const { data } = await axios.post(
        `${BACKEND_URL}/api/message/send`,
        { receiverId, text: message },
        { withCredentials: true }
      );
      if (data.success) {
        setMessage("");
        stopTyping(receiverId);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const startEdit = (messageId, currentText) => {
    setEditingMessage(messageId);
    setEditText(currentText);
  };

  const saveEdit = async () => {
    if (!editText.trim()) {
      toast.error("Message cannot be empty");
      return;
    }
    try {
      const { data } = await axios.put(
        `${BACKEND_URL}/api/message/edit/${editingMessage}`,
        { text: editText },
        { withCredentials: true }
      );
      if (data.success) {
        setEditingMessage(null);
        setEditText("");
        toast.success("Message updated!");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const cancelEdit = () => {
    setEditingMessage(null);
    setEditText("");
  };

  const deleteMessage = async (messageId) => {
    try {
      const { data } = await axios.delete(
        `${BACKEND_URL}/api/message/delete/${messageId}`,
        { withCredentials: true }
      );
      if (data.success) {
        toast.success("Message deleted!");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const handleTyping = (receiverId) => {
    if (socket && receiverId) {
      socket.emit('typing_start', {
        receiverId: receiverId,
        senderId: loggedInUserId
      });

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        stopTyping(receiverId);
      }, 1000);
    }
  };

  const stopTyping = (receiverId) => {
    if (socket && receiverId) {
      socket.emit('typing_stop', {
        receiverId: receiverId,
        senderId: loggedInUserId
      });
    }
  };

  const groupMessagesByDate = (messages) => {
    const groups = {};
    messages.forEach(message => {
      const date = new Date(message.timestamp).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    return groups;
  };

  useEffect(() => {
    totalUser();
  }, [socket]);

  useEffect(() => {
    if (selectedUser) {
      fetchMessages(selectedUser._id);
    }
  }, [selectedUser]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory, typingUsers]);

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (dateString) => {
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    const date = new Date(dateString).toDateString();

    if (date === today) return 'Today';
    if (date === yesterday) return 'Yesterday';
    return new Date(dateString).toLocaleDateString();
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setUnseenCounts(prev => ({
      ...prev,
      [user._id]: 0
    }));
  };

  return (
    <div className="bg-gray-900 w-full h-screen flex flex-col md:flex-row text-white font-sans">
      {/* Users List */}
      <div className={`w-full md:w-[30%] h-full bg-gray-800 shadow-xl overflow-y-auto ${selectedUser ? 'hidden md:block' : 'block'}`}>
        <div className="p-4 md:p-6">
          <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-orange-400">Users</h2>
          {users.map((user, index) => (
            <div
              key={index}
              className={`flex items-center gap-3 md:gap-4 mb-3 md:mb-4 p-3 rounded-xl cursor-pointer transition-all duration-200 hover:bg-gray-700 relative ${
                selectedUser?._id === user._id ? "bg-gray-700 shadow-md" : ""
              }`}
              onClick={() => handleUserSelect(user)}
            >
              <img
                src={`https://api.dicebear.com/9.x/adventurer/svg?seed=${user.email}`}
                alt={`${user.username}'s avatar`}
                className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-orange-400"
              />
              <div className="flex-1">
                <h1 className="text-base md:text-lg font-semibold">{user.username}</h1>
                <p className="text-xs md:text-sm text-gray-400">{user.email}</p>
                {typingUsers[user._id] && (
                  <p className="text-xs text-orange-400 italic">typing...</p>
                )}
              </div>
              {unseenCounts[user._id] > 0 && (
                <span className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {unseenCounts[user._id]}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`w-full md:w-[70%] h-full flex flex-col ${selectedUser ? 'block' : 'hidden md:block'}`}>
        {selectedUser ? (
          <>
            <div className="bg-orange-600 p-3 md:p-4 flex items-center gap-3 md:gap-4 shadow-md">
              <button
                className="md:hidden text-white text-lg w-10 z-10"
                onClick={() => setSelectedUser(null)}
              >
                ←
              </button>
              <img
                src={`https://api.dicebear.com/9.x/adventurer/svg?seed=${selectedUser.email}`}
                alt={`${selectedUser.username}'s avatar`}
                className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-white"
              />
              <h2 className="text-lg md:text-xl font-bold">{selectedUser.username}</h2>
              {typingUsers[selectedUser._id] && (
                <p className="text-sm italic text-white ml-2">typing...</p>
              )}
            </div>

            {/* Messages Area */}
            <div ref={chatContainerRef} className="flex-1 p-4 md:p-6 bg-gray-850 overflow-y-auto">
              {(chatHistory[selectedUser._id] || []).length > 0 ? (
                Object.entries(groupMessagesByDate(chatHistory[selectedUser._id])).map(([date, messages]) => (
                  <div key={date}>
                    <div className="text-center my-4">
                      <span className="bg-gray-700 px-3 py-1 rounded-full text-xs text-gray-300">
                        {formatDate(date)}
                      </span>
                    </div>
                    {messages.map((msg, idx) => (
                      <div
                        key={msg._id || idx}
                        className={`flex mb-3 md:mb-4 ${
                          msg.sender === "me" ? "justify-end" : "justify-start"
                        }`}
                      >
                        {/* Receiver Message - Left Side */}
                        {msg.sender === "other" && (
                          <div className="max-w-[80%] md:max-w-[70%]">
                            <div className="bg-gray-700 p-3 md:p-4 rounded-xl rounded-bl-none shadow-sm">
                              <p className="text-sm md:text-base text-white">{msg.text}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <p className="text-xs text-gray-300">
                                  {formatTime(msg.timestamp)}
                                </p>
                                {msg.edited && (
                                  <span className="text-xs text-gray-400">(edited)</span>
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Sender Message - Right Side */}
                        {msg.sender === "me" && (
                          <div className="max-w-[80%] md:max-w-[70%] flex flex-col items-end">
                            {editingMessage === msg._id ? (
                              // Edit Mode
                              <div className="bg-blue-700 p-3 md:p-4 rounded-xl rounded-br-none shadow-sm w-full">
                                <input
                                  ref={editInputRef}
                                  type="text"
                                  value={editText}
                                  onChange={(e) => setEditText(e.target.value)}
                                  onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                      saveEdit();
                                    }
                                  }}
                                  className="w-full bg-blue-600 text-white p-2 rounded border border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                                <div className="flex gap-2 justify-end mt-2">
                                  <button
                                    onClick={saveEdit}
                                    className="text-xs bg-green-500 px-3 py-1 rounded hover:bg-green-600 transition-colors"
                                  >
                                    Save
                                  </button>
                                  <button
                                    onClick={cancelEdit}
                                    className="text-xs bg-gray-500 px-3 py-1 rounded hover:bg-gray-600 transition-colors"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              // Normal Message View
                              <div className="relative group">
                                <div className="bg-blue-600 p-3 md:p-4 rounded-xl rounded-br-none shadow-sm">
                                  <p className="text-sm md:text-base text-white">{msg.text}</p>
                                  <div className="flex items-center gap-2 mt-1 justify-end">
                                    <span className="text-xs text-blue-200">
                                      {msg.seen ? '✓✓' : '✓'}
                                    </span>
                                    {msg.edited && (
                                      <span className="text-xs text-blue-200">(edited)</span>
                                    )}
                                    <p className="text-xs text-blue-200">
                                      {formatTime(msg.timestamp)}
                                    </p>
                                  </div>
                                </div>
                                
                                {/* Edit/Delete Buttons - Always visible for sender messages */}
                                <div className="absolute -left-14 top-1/2 transform -translate-y-1/2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                  <button
                                    onClick={() => startEdit(msg._id, msg.text)}
                                    className="text-xs bg-yellow-500 px-2 py-1 rounded hover:bg-yellow-600 transition-colors whitespace-nowrap"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => deleteMessage(msg._id)}
                                    className="text-xs bg-red-500 px-2 py-1 rounded hover:bg-red-600 transition-colors whitespace-nowrap"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-400">No messages yet. Start a conversation!</p>
                </div>
              )}
            </div>

            {/* Message Input */}
            <div className="p-3 md:p-4 bg-gray-800 flex gap-2 md:gap-3 border-t border-gray-700">
              <input
                type="text"
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  if (selectedUser) {
                    handleTyping(selectedUser._id);
                  }
                }}
                onKeyPress={(e) => e.key === "Enter" && sendMessage(selectedUser._id)}
                placeholder="Type a message..."
                className="flex-1 p-2 md:p-3 rounded-xl bg-gray-700 text-white placeholder-gray-400 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              <button
                onClick={() => sendMessage(selectedUser._id)}
                className="bg-orange-500 px-4 md:px-6 py-2 md:py-3 rounded-xl hover:bg-orange-600 transition-colors duration-200 font-semibold text-sm md:text-base"
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-850 h-full">
            <p className="text-base md:text-lg text-gray-400 capitalize">Select a user to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chating;