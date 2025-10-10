import express from "express"
import { getMessages, sendMessage, editMessage, deleteMessage, getUnseenCount } from "../Controllers/messageController.js";
import isAuthenticated from "../Middleware/auth.js";

const messageRouter = express.Router();

messageRouter.post('/send', isAuthenticated, sendMessage);
messageRouter.get('/get/:userId', isAuthenticated, getMessages);
messageRouter.put('/edit/:messageId', isAuthenticated, editMessage);
messageRouter.delete('/delete/:messageId', isAuthenticated, deleteMessage);
messageRouter.get('/unseen-count', isAuthenticated, getUnseenCount);

export default messageRouter;