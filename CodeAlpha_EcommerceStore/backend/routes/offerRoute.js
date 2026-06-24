import express from "express"
import { listOffers, getOffer, createOffer, updateOffer, deleteOffer } from "../controllers/offerController.js"
import { isAdmin, isAuthenticated } from "../middleware/isAuthenticated.js"

const router = express.Router()

router.get("/", listOffers)
router.get("/:id", getOffer)
router.post("/create-offer", isAuthenticated, isAdmin, createOffer)
router.put("/update-offer/:id", isAuthenticated, isAdmin, updateOffer)
router.delete("/delete-offer/:id", isAuthenticated, isAdmin, deleteOffer)

export default router
