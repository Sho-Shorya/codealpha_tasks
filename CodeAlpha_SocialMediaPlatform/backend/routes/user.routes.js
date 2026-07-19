import express from "express"
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import { editProfile, follow, getCurrentUser, getProfile, login, logout, suggestedUsers } from "../controllers/userController.js";
import { Upload } from "../middleware/multer.js";

export const userRouter = express.Router();

userRouter.get('/current',isAuthenticated, getCurrentUser) 
userRouter.get('/suggested',isAuthenticated, suggestedUsers)
userRouter.get('/profile/:userName', getProfile)
userRouter.get('/follow/:targetUserId',isAuthenticated, follow)
userRouter.post('/editprofile',isAuthenticated,Upload.single("profilePic") ,editProfile)