import express, { Router } from "express"
import { addToCart, getCart, removeFromCart, UpdateQuantity } from "../controllers/cartController.js"
import { isAuthenticated } from "../middleware/isAuthenticated.js"
const router = Router()

router.get("/", isAuthenticated, getCart)
router.post("/add-cart",isAuthenticated, addToCart)
router.put("/update-cart", isAuthenticated, UpdateQuantity)
router.delete("/remove-cart", isAuthenticated, removeFromCart)


export default router 
