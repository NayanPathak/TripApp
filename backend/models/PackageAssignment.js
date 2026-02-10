const mongoose = require('mongoose');

const packageAssignmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    packageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Package',
      required: true,
    },
    assignedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

packageAssignmentSchema.index({ userId: 1, packageId: 1 }, { unique: true });

module.exports = mongoose.model('PackageAssignment', packageAssignmentSchema);
