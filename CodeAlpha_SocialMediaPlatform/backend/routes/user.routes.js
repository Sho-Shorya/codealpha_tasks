import express from "express"
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import { getCurrentUser, login, logout } from "../controllers/userController.js";

export const userRouter = express.Router();

userRouter.get('/current',isAuthenticated, getCurrentUser)