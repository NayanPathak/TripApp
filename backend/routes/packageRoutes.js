import express from "express";
import {
  createPackage,
  getPackages,
  assignPackage,
} from "../controllers/packageController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(protect, getPackages).post(protect, createPackage);

router.post("/assign", protect, assignPackage);

export default router;
