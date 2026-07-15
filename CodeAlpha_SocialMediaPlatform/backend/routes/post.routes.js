import express from "express"
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import { Upload } from "../middleware/multer.js";
import { comment, getAllPost, like, uploadPost } from "../controllers/post.controller.js";

export const postRouter = express.Router();

postRouter.post('/upload',isAuthenticated, Upload.single("media"), uploadPost) 
postRouter.get('/getAll',isAuthenticated, getAllPost)
postRouter.get('/like/:postId',isAuthenticated, like)
postRouter.post('/comment',isAuthenticated ,comment)
