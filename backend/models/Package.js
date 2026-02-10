const mongoose = require('mongoose');

const placeToVisitSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  visitTime: { type: String, default: '' },
});

const dayItinerarySchema = new mongoose.Schema({
  dayNumber: { type: Number, required: true },
  hotel: {
    name: { type: String, default: '' },
    address: { type: String, default: '' },
    checkInTime: { type: String, default: '' },
  },
  taxi: {
    pickupLocation: { type: String, default: '' },
    pickupTime: { type: String, default: '' },
    vehicleType: { type: String, default: '' },
  },
  placesToVisit: [placeToVisitSchema],
  images: [{ type: String }],
});

const packageSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    cities: [{ type: String }],
    totalDays: { type: Number, required: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    itinerary: [dayItinerarySchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Package', packageSchema);
