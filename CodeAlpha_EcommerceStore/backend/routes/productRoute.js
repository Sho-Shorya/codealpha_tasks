import express, { Router } from "express"
import { addProduct, getAllProduct } from "../controllers/productController.js"
import { isAdmin, isAuthenticated } from "../middleware/isAuthenticated.js"
import { multipleUpload } from "../middleware/multer.js"

const router = Router()

router.post("/add", isAuthenticated, isAdmin, multipleUpload, addProduct)
router.get("/getallproducts", getAllProduct)

export default router 
