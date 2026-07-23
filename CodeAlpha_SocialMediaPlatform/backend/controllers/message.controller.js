import uploadToCloudinary from "../config/cloudinary.js";
import Conversation from "../models/conversationModel.js";
import Message from "../models/messageModel.js";
import { getSocketId } from "../socket.js";

export const sendMessage = async (req, res) => {
  try {
    const senderId = req.userId;
    const receiverId = req.params.receiverId;
    const { message } = req.body;

    let image;
    if (req.file) {
      image = await uploadToCloudinary(req.file.path)
    }
    const newMessage = await Message.create({
      sender: senderId,
      receiver: receiverId,
      message: message,
      image: image
    })

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] }
    })
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
        messages: [newMessage._id]
      })
    } else {
      conversation.messages.push(newMessage._id)
      await conversation.save()
    }

    //socket io
    const receiverSocketId = getSocketId(receiverId)
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage)
    }

    return res.status(200).json(newMessage)

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

export const getAllMessages = async (req, res) => {
  try {
    const senderId = req.userId;
    const receiverId = req.params.receiverId;
    const conversation = await Conversation.findOne({ participants: { $all: [senderId, receiverId] } }).populate('messages')
    return res.status(200).json(conversation?.messages)
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}


export const getPrevUserChats = async (req, res) => {
  try {
    const currentUserId = req.userId;
    const conversations = await Conversation.find({
      participants: currentUserId
    }).populate('participants').sort({ updatedAt: -1 })

    const userMap = {}  //stores 208h28(userid) as key and user as value
    conversations.forEach(conv => {
      conv.participants.forEach(user => {
        if (user._id.toString() !== currentUserId.toString()) {
          userMap[user._id.toString()] = user
        }
      })
    })

    const previousUsers = Object.values(userMap)

    return res.status(200).json(previousUsers)
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}