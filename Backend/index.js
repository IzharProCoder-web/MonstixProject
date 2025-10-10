import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDb from "./config/db.js";
import userRouter from "./routes/userRouter.js";
import cookieParser from "cookie-parser";
import adminRouter from "./routes/adminRouter.js";
import messageRouter from "./routes/messageRouter.js";
import { Server } from 'socket.io'
import http from 'http'
import Message from "./Model/Message.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "https://monstix-project-frontend.vercel.app",
      "http://localhost:5173",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  }
});

const PORT = process.env.PORT;

await connectDb();

const allowOrigin = [
  "https://monstix-project-frontend.vercel.app",
  "http://localhost:5173",
];

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: allowOrigin,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

// Make io accessible to routes
app.set('io', io);

app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/message", messageRouter);

app.get("/", (req, res) => {
  res.send("Api Is Working ");
});

const userSockets = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('user_connected', (userId) => {
    userSockets.set(userId, socket.id);
    socket.userId = userId;
    console.log(`User ${userId} connected with socket ${socket.id}`);
  });

  socket.on('typing_start', (data) => {
    const receiverSocketId = userSockets.get(data.receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('user_typing', {
        senderId: data.senderId,
        isTyping: true
      });
    }
  });

  socket.on('typing_stop', (data) => {
    const receiverSocketId = userSockets.get(data.receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('user_typing', {
        senderId: data.senderId,
        isTyping: false
      });
    }
  });

  socket.on('message_seen', async (data) => {
    try {
      await Message.updateMany(
        {
          sender: data.senderId,
          receiver: data.receiverId,
          seen: false
        },
        { seen: true, seenAt: new Date() }
      );

      const senderSocketId = userSockets.get(data.senderId);
      if (senderSocketId) {
        io.to(senderSocketId).emit('messages_seen', {
          receiverId: data.receiverId
        });
      }
    } catch (error) {
      console.error('Error updating message seen status:', error);
    }
  });

  socket.on('disconnect', () => {
    if (socket.userId) {
      userSockets.delete(socket.userId);
    }
    console.log('User disconnected:', socket.id);
  });
});

server.listen(PORT, (req, res) => {
  console.log(`The Server Is Running on ${PORT} `);
});