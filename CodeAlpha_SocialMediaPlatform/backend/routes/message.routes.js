import express from "express"
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import { Upload } from "../middleware/multer.js";
import { getAllMessages, getPrevUserChats, sendMessage } from "../controllers/message.controller.js";

export const messageRouter = express.Router();

messageRouter.post('/send/:receiverId',isAuthenticated, Upload.single("image"), sendMessage) 
messageRouter.get('/getallmess/:receiverId',isAuthenticated, getAllMessages)
messageRouter.delete('/prevChats',isAuthenticated, getPrevUserChats ) 
 