import express, { Router } from "express"
import { addProduct, getallproducts, deleteProduct, updateProduct } from "../controllers/productController.js"
import { isAdmin, isAuthenticated } from "../middleware/isAuthenticated.js"
import { multipleUpload } from "../middleware/multer.js"

const router = Router()

router.post("/add", isAuthenticated, isAdmin, multipleUpload, addProduct)
router.get("/getallproducts", getallproducts)
router.delete("/delete/:productId", isAuthenticated, isAdmin, deleteProduct)
router.put("/update/:productId", isAuthenticated, isAdmin, multipleUpload, updateProduct)

export default router 
