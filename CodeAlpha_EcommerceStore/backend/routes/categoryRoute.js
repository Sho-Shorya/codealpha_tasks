import express from "express"
import { listCategories, getCategory, createCategory, updateCategory, deleteCategory } from "../controllers/categoryController.js"
import { isAdmin, isAuthenticated } from "../middleware/isAuthenticated.js"

const router = express.Router()

router.get("/", listCategories)
router.get("/get-cat/:id", getCategory)
router.post("/create-cat", isAuthenticated, isAdmin, createCategory)
router.put("/update-cat/:id", isAuthenticated, isAdmin, updateCategory)
router.delete("/delete-cat/:id", isAuthenticated, isAdmin, deleteCategory)

export default router
