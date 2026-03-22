import express from "express";
import protect from "../middleware/authMiddleware.js";
import requireAdmin from "../middleware/adminMiddleware.js";
import {
  getAgents,
  createAgent,
  updateAgent,
  deleteAgent,
} from "../controllers/adminController.js";

const router = express.Router();

router.get("/agents", protect, requireAdmin, getAgents);
router.post("/agents", protect, requireAdmin, createAgent);
router.put("/agents/:id", protect, requireAdmin, updateAgent);
router.delete("/agents/:id", protect, requireAdmin, deleteAgent);

export default router;
