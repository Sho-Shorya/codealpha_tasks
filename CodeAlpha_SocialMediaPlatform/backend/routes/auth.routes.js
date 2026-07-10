import express from "express"
import { login, logout, register } from "../controllers/userController.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";

export const authRouter = express.Router();

authRouter.post('/register', register)
authRouter.post('/login', login)
authRouter.post('/logout', isAuthenticated, logout)
