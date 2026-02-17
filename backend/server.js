import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js"; // Note the .js extension

// Import Routes
import authRoutes from "./routes/authRoutes.js";
import packageRoutes from "./routes/packageRoutes.js";

dotenv.config();

const app = express();
connectDB();

app.use(express.json());
app.use(cors());

// Mount Routes
app.get("/", (req, res) => {
  res.send("Trip Itinerary API is running successfully!");
});
app.use("/api/auth", authRoutes);
app.use("/api/packages", packageRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
