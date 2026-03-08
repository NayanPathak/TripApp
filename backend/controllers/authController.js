// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import User from "../models/User.js";

// const generateToken = (id, role) => {
//   return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "30d" });
// };

// // Agent Registration
// export const register = async (req, res) => {
//   const { name, email, password } = req.body;

//   try {
//     const existingUser = await User.findOne({ email });
//     if (existingUser)
//       return res
//         .status(400)
//         .json({ success: false, message: "User already exists" });

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const user = await User.create({
//       name,
//       email,
//       password: hashedPassword,
//       role: "agent",
//     });

//     res.status(201).json({
//       success: true,
//       token: generateToken(user._id, user.role),
//       role: user.role,
//     });
//   } catch (err) {
//     res.status(400).json({ success: false, message: err.message });
//   }
// };

// // Login (Handles both Email and Mobile)
// export const login = async (req, res) => {
//   // 'email' here is just the variable name from the frontend request,
//   // but the value could actually be a mobile number.
//   const { email, password } = req.body;

//   try {
//     // Search the database for a user where EITHER the email matches OR the mobile matches
//     const user = await User.findOne({
//       $or: [{ email: email }, { mobile: email }],
//     });

//     if (user && (await bcrypt.compare(password, user.password))) {
//       res.json({
//         success: true,
//         token: generateToken(user._id, user.role),
//         role: user.role,
//         name: user.name,
//       });
//     } else {
//       res.status(401).json({ success: false, message: "Invalid credentials" });
//     }
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // Create User (By Agent)
// export const createUser = async (req, res) => {
//   if (req.user.role !== "agent") {
//     return res.status(403).json({ success: false, message: "Not authorized" });
//   }

//   const { name, mobile, password } = req.body;

//   // Create a dummy email for the user since the schema requires it
//   const email = `${mobile}@tripapp.com`;

//   try {
//     // Check if user exists by mobile
//     const existingUser = await User.findOne({ mobile });
//     if (existingUser) {
//       return res
//         .status(400)
//         .json({
//           success: false,
//           message: "User with this mobile number already exists",
//         });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const user = await User.create({
//       name,
//       email,
//       mobile,
//       password: hashedPassword,
//       role: "user",
//     });

//     res.status(201).json({ success: true, data: user });
//   } catch (err) {
//     res.status(400).json({ success: false, message: err.message });
//   }
// };

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Helper function to generate JWT
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// ==========================================
// 1. Agent Registration
// ==========================================
export const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({
          success: false,
          message: "User already exists with this email.",
        });
    }

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

// ==========================================
// 2. Login (Handles BOTH Email and Mobile)
// ==========================================
export const login = async (req, res) => {
  // We accept 'identifier' (best practice) OR 'email' (fallback for older frontend code)
  const identifier = req.body.identifier || req.body.email;
  const { password } = req.body;

  if (!identifier || !password) {
    return res
      .status(400)
      .json({
        success: false,
        message: "Please provide both an identifier and a password.",
      });
  }

  try {
    // Search for a user where EITHER the email OR the mobile matches the input
    const user = await User.findOne({
      $or: [{ email: identifier }, { mobile: identifier }],
    });

    // Check if user exists AND password is correct
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        success: true,
        token: generateToken(user._id, user.role),
        role: user.role,
        name: user.name,
      });
    } else {
      // 401 Unauthorized for bad credentials
      res
        .status(401)
        .json({ success: false, message: "Invalid email/mobile or password." });
    }
  } catch (error) {
    console.error("Login Error:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Server error during login.",
        error: error.message,
      });
  }
};

// ==========================================
// 3. Create User (Only allowed by Agents)
// ==========================================
export const createUser = async (req, res) => {
  // Security check: Ensure the person making the request is an Agent
  if (req.user.role !== "agent") {
    return res
      .status(403)
      .json({
        success: false,
        message: "Not authorized. Only agents can create users.",
      });
  }

  const { name, mobile, password } = req.body;

  // Create a dummy email for the user since your schema likely requires it
  const email = `${mobile}@tripapp.com`;

  try {
    // Check if a user with this mobile number already exists
    const existingUser = await User.findOne({ mobile });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this mobile number already exists",
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

    res.status(201).json({ success: true, data: user });
  } catch (err) {
    console.error("Create User Error:", err);
    res.status(400).json({ success: false, message: err.message });
  }
};