import express from "express"
import { listCategories, getCategory, createCategory, updateCategory, deleteCategory } from "../controllers/categoryController.js"
import { isAdmin, isAuthenticated } from "../middleware/isAuthenticated.js"

const router = express.Router()

router.get("/", listCategories)
router.get("/:id", getCategory)
router.post("/", isAuthenticated, isAdmin, createCategory)
router.put("/:id", isAuthenticated, isAdmin, updateCategory)
router.delete("/:id", isAuthenticated, isAdmin, deleteCategory)

export default router
