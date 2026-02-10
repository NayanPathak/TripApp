const Package = require('../models/Package');
const cloudinary = require('../config/cloudinary');

const uploadImageToCloudinary = (file) =>
  new Promise((resolve, reject) => {
    if (!file || !file.buffer) {
      resolve(null);
      return;
    }
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'trip-itinerary' },
      (err, result) => {
        if (err) reject(err);
        else resolve(result?.secure_url);
      }
    );
    uploadStream.end(file.buffer);
  });

exports.createPackage = async (req, res) => {
  try {
    const { title, cities, totalDays, itinerary } = req.body;
    if (!title || !totalDays) {
      return res.status(400).json({ message: 'Title and totalDays are required' });
    }
    let parsedItinerary = [];
    if (itinerary && typeof itinerary === 'string') {
      parsedItinerary = JSON.parse(itinerary);
    } else if (Array.isArray(itinerary)) {
      parsedItinerary = itinerary;
    }
    const packageData = {
      title,
      cities: Array.isArray(cities) ? cities : (cities ? JSON.parse(cities) : []),
      totalDays: Number(totalDays),
      createdBy: req.user.id,
      itinerary: parsedItinerary,
    };
    const pkg = await Package.create(packageData);
    res.status(201).json(pkg);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.uploadDayImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }
    const urls = await Promise.all(
      req.files.map((file) => uploadImageToCloudinary(file))
    );
    res.json({ urls: urls.filter(Boolean) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllPackages = async (req, res) => {
  try {
    const packages = await Package.find({ createdBy: req.user.id })
      .populate('createdBy', 'email name')
      .sort({ createdAt: -1 });
    res.json(packages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPackageById = async (req, res) => {
  try {
    const pkg = await Package.findById(req.params.id).populate('createdBy', 'email name');
    if (!pkg) {
      return res.status(404).json({ message: 'Package not found' });
    }
    res.json(pkg);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updatePackage = async (req, res) => {
  try {
    const pkg = await Package.findById(req.params.id);
    if (!pkg) {
      return res.status(404).json({ message: 'Package not found' });
    }
    if (pkg.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this package' });
    }
    const { title, cities, totalDays, itinerary } = req.body;
    if (title) pkg.title = title;
    if (cities !== undefined) {
      pkg.cities = Array.isArray(cities) ? cities : JSON.parse(cities || '[]');
    }
    if (totalDays !== undefined) pkg.totalDays = Number(totalDays);
    if (itinerary !== undefined) {
      pkg.itinerary = Array.isArray(itinerary) ? itinerary : JSON.parse(itinerary || '[]');
    }
    await pkg.save();
    res.json(pkg);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deletePackage = async (req, res) => {
  try {
    const pkg = await Package.findById(req.params.id);
    if (!pkg) {
      return res.status(404).json({ message: 'Package not found' });
    }
    if (pkg.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this package' });
    }
    await pkg.deleteOne();
    res.json({ message: 'Package deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
