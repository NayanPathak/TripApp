import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

/** Used only via Postman / bootstrap — not exposed in the app. */
const CREATE_ADMIN_SECRET = "SuperSecretBossKey99";

// =============================
// Bootstrap admin (secret key required)
// =============================

export const createAdmin = async (req, res) => {
  const { name, email, password, secretKey } = req.body;

  if (secretKey !== CREATE_ADMIN_SECRET) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Name, email, and password are required.",
    });
  }

  try {
    const emailNorm = String(email).trim().toLowerCase();
    const existing = await User.findOne({ email: emailNorm });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "A user with this email already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: String(name).trim(),
      email: emailNorm,
      password: hashedPassword,
      role: "admin",
    });

    res.status(201).json({
      success: true,
      message: "Admin user created.",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// =============================
// Login
// =============================

export const login = async (req, res) => {
  console.log("LOGIN DEBUG - FULL BODY:", {
    body: req.body,
    identifier: req.body.identifier,
    email: req.body.email,
    passwordExists: !!req.body.password,
    contentType: req.headers["content-type"],
  });
  const identifier = req.body.identifier || req.body.email;
  const { password } = req.body;

  console.log("LOGIN DEBUG - Received:", {
    identifier,
    hasPassword: !!password,
  });

  if (!identifier || !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide both identifier and password.",
    });
  }

  try {
    const user = await User.findOne({
      $or: [{ email: identifier }, { mobile: identifier }],
    });

    console.log(
      "LOGIN DEBUG - User found:",
      user
        ? {
            id: user._id,
            email: user.email,
            mobile: user.mobile,
            role: user.role,
          }
        : "NULL",
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found. Check if you registered correctly.",
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    console.log("LOGIN DEBUG - Password match:", passwordMatch);

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid password.",
      });
    }

    const token = generateToken(user._id, user.role);
    console.log("LOGIN DEBUG - Token generated:", token ? "YES" : "NO");

    res.json({
      success: true,
      token: token,
      role: user.role,
      name: user.name,
    });
  } catch (error) {
    console.error("Login Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error during login: " + error.message,
    });
  }
};

// =============================
// Create User (Agent only)
// =============================
export const createUser = async (req, res) => {
  if (req.user.role !== "agent") {
    return res.status(403).json({
      success: false,
      message: "Not authorized. Only agents can create users.",
    });
  }

  const { name, mobile, password } = req.body;

  const email = `${mobile}@tripapp.com`;

  try {
    const existingUser = await User.findOne({ mobile });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this mobile already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      mobile,
      password: hashedPassword,
      role: "user",
    });

    res.status(201).json({
      success: true,
      data: user,
    });
  } catch (err) {
    console.error("Create User Error:", err);

    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
