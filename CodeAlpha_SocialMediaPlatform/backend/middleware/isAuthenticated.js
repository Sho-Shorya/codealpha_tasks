import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";
import "dotenv/config"

export const isAuthenticated = async (req, res, next) => {

  try {
    let token
    const authHeader = req.headers.authorization
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1]
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authorization token is missing or invalid"
      })
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET) 
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(400).json({
          success: false,
          message: "The registration Token expired"
        })
      }
      return res.status(400).json({ success: false, message: "Access token is missing or invalid" })
    }

    const user = await User.findById(decoded.id)
    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" })
    }
    req.userId = user._id
    req.user = user

    next()

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}