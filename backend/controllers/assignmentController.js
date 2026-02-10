const PackageAssignment = require('../models/PackageAssignment');
const Package = require('../models/Package');
const User = require('../models/User');

exports.assignPackage = async (req, res) => {
  try {
    const { userId, packageId } = req.body;
    if (!userId || !packageId) {
      return res.status(400).json({ message: 'userId and packageId are required' });
    }
    const user = await User.findById(userId);
    if (!user || user.role !== 'user') {
      return res.status(400).json({ message: 'Invalid user' });
    }
    const pkg = await Package.findById(packageId);
    if (!pkg) {
      return res.status(400).json({ message: 'Package not found' });
    }
    if (pkg.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to assign this package' });
    }
    const existing = await PackageAssignment.findOne({ userId, packageId });
    if (existing) {
      return res.status(400).json({ message: 'Package already assigned to this user' });
    }
    const assignment = await PackageAssignment.create({ userId, packageId });
    const populated = await PackageAssignment.findById(assignment._id)
      .populate('userId', 'email name')
      .populate('packageId', 'title cities totalDays');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAssignmentsByPackage = async (req, res) => {
  try {
    const assignments = await PackageAssignment.find({ packageId: req.params.packageId })
      .populate('userId', 'email name');
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyAssignedPackages = async (req, res) => {
  try {
    const assignments = await PackageAssignment.find({ userId: req.user.id })
      .populate('packageId');
    const packages = assignments.map((a) => a.packageId).filter(Boolean);
    res.json(packages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
