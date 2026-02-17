import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// Agent Registration
export const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "agent",
    });

    res.status(201).json({
      success: true,
      token: generateToken(user._id, user.role),
      role: user.role,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Login
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        success: true,
        token: generateToken(user._id, user.role),
        role: user.role,
        name: user.name,
      });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create User (By Agent)
export const createUser = async (req, res) => {
  if (req.user.role !== "agent") {
    return res.status(403).json({ success: false, message: "Not authorized" });
  }

  const { name, mobile, password } = req.body;
  // Fallback email generation
  const email = `${mobile}@tripapp.com`;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      mobile,
      password: hashedPassword,
      role: "user",
    });

    res.status(201).json({ success: true, data: user });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
