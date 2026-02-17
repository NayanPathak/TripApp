import Package from "../models/Package.js";
import PackageAssignment from "../models/PackageAssignment.js";
import User from "../models/User.js";

export const createPackage = async (req, res) => {
  if (req.user.role !== "agent") {
    return res.status(403).json({ success: false, message: "Agent only" });
  }

  try {
    const newPackage = await Package.create({
      ...req.body,
      createdBy: req.user.id,
    });
    res.status(201).json({ success: true, data: newPackage });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const getPackages = async (req, res) => {
  try {
    if (req.user.role === "agent") {
      // Agent sees packages they created
      const packages = await Package.find({ createdBy: req.user.id });
      res.json({ success: true, data: packages });
    } else {
      // User sees assigned packages
      const assignments = await PackageAssignment.find({
        userId: req.user.id,
      }).populate("packageId");
      // Extract the actual package documents from assignments
      const packages = assignments
        .filter((a) => a.packageId != null) // Safety check if package was deleted
        .map((a) => a.packageId);

      res.json({ success: true, data: packages });
    }
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const assignPackage = async (req, res) => {
  if (req.user.role !== "agent") {
    return res.status(403).json({ success: false, message: "Agent only" });
  }

  const { mobile, packageId } = req.body;

  try {
    const user = await User.findOne({ mobile });
    if (!user) {
      return res
        .status(404)
        .json({
          success: false,
          message: "User not found with this mobile number",
        });
    }

    await PackageAssignment.create({ userId: user._id, packageId });
    res.json({ success: true, message: "Assigned successfully" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
