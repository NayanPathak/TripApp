import express from "express";
import { login, createUser, createAdmin } from "../controllers/authController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", login);
router.post("/create-admin", createAdmin);
router.post("/create-user", protect, createUser);

export default router;
