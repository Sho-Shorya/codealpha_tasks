import express from "express"
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import { Upload } from "../middleware/multer.js";
import { comment, deleteComment, deletePost, getAllPost, like, uploadPost } from "../controllers/post.controller.js";

export const postRouter = express.Router();

postRouter.post('/upload',isAuthenticated, Upload.single("media"), uploadPost) 
postRouter.delete('/delete/:postId',isAuthenticated, deletePost) 
postRouter.get('/getall',isAuthenticated, getAllPost)
postRouter.get('/like/:postId',isAuthenticated, like)
postRouter.post('/comment/:postId',isAuthenticated ,comment)
postRouter.delete("/comment/:postId/:commentId",isAuthenticated,deleteComment);