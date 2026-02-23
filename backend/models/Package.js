import mongoose from "mongoose";

// 1. Define sub-schemas for cleaner structure
const PlaceSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g., "Ajmer Fort"
  type: { type: String, default: "Sightseeing" }, // e.g., "Fort", "Museum"
  time: String, // e.g., "3:00 PM"
  image: String, // The specific image for this place
  description: String,
});

const HotelSchema = new mongoose.Schema({
  name: String,
  address: String,
  checkIn: String,
  image: String,
});

const TaxiSchema = new mongoose.Schema({
  pickupLocation: String,
  pickupTime: String,
  vehicleType: String, // e.g., "Sedan", "SUV"
  driverContact: String,
});

// 2. Update the main Package Schema
const PackageSchema = new mongoose.Schema({
  title: { type: String, required: true },
  cities: { type: String, required: true },
  totalDays: { type: Number, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  itinerary: [
    {
      dayNumber: { type: Number, required: true },
      title: String, // Optional: "Arrival in Jaipur"
      hotel: HotelSchema, // Now an Object, not a String
      taxi: TaxiSchema, // Now an Object, not a String
      places: [PlaceSchema], // Array of place objects
    },
  ],
});

export default mongoose.model("Package", PackageSchema);
