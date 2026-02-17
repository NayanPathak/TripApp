import mongoose from "mongoose";

const AssignmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  packageId: { type: mongoose.Schema.Types.ObjectId, ref: "Package" },
  assignedAt: { type: Date, default: Date.now },
});

export default mongoose.model("PackageAssignment", AssignmentSchema);
