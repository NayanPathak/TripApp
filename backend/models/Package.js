import mongoose from "mongoose";

const PackageSchema = new mongoose.Schema({
  title: { type: String, required: true },
  cities: { type: String, required: true },
  totalDays: { type: Number, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  itinerary: [
    {
      dayNumber: Number,
      hotel: String,
      taxi: String,
      placesToVisit: String,
      images: [String],
    },
  ],
});

export default mongoose.model("Package", PackageSchema);
