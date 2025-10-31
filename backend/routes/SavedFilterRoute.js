import express from "express";
const router = express.Router();
import SavedFilterController from "../controllers/SavedFilterController.js";
import { verifyToken } from "../middleware/verifyToken.js";
// All routes require authentication
router.use(verifyToken);

// Create saved filter
router.post("/", SavedFilterController.createSavedFilter);

// Get all saved filters for current user
router.get("/", SavedFilterController.getUserSavedFilters);

// Get single saved filter
router.get("/:id", SavedFilterController.getSavedFilterById);

// Update saved filter
router.put("/:id", SavedFilterController.updateSavedFilter);

// Delete saved filter
router.delete("/:id", SavedFilterController.deleteSavedFilter);

// Set filter as default
router.patch("/:id/set-default", SavedFilterController.setAsDefault);

export default router;
