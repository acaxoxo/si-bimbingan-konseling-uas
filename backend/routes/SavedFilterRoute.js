import express from "express";
const router = express.Router();
import SavedFilterController from "../controllers/SavedFilterController.js";
import { verifyToken } from "../middleware/verifyToken.js";

router.use(verifyToken);

router.post("/", SavedFilterController.createSavedFilter);

router.get("/", SavedFilterController.getUserSavedFilters);

router.get("/:id", SavedFilterController.getSavedFilterById);

router.put("/:id", SavedFilterController.updateSavedFilter);

router.delete("/:id", SavedFilterController.deleteSavedFilter);

router.patch("/:id/set-default", SavedFilterController.setAsDefault);

export default router;
