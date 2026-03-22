import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import User from "../models/User.js";

export const getAgents = async (req, res) => {
  try {
    const agents = await User.find({ role: "agent" })
      .select("-password")
      .sort({ name: 1 })
      .lean();

    res.json({ success: true, data: agents });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createAgent = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Name, email, and password are required.",
    });
  }

  try {
    const emailNorm = String(email).trim().toLowerCase();
    const existingUser = await User.findOne({ email: emailNorm });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: String(name).trim(),
      email: emailNorm,
      password: hashedPassword,
      role: "agent",
    });

    res.status(201).json({
      success: true,
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

export const updateAgent = async (req, res) => {
  const { id } = req.params;
  const { name, email, mobile } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Invalid agent id." });
  }

  try {
    const agent = await User.findById(id);
    if (!agent || agent.role !== "agent") {
      return res.status(404).json({ success: false, message: "Agent not found." });
    }

    if (email !== undefined) {
      const emailNorm = String(email).trim().toLowerCase();
      if (emailNorm !== agent.email) {
        const taken = await User.findOne({
          email: emailNorm,
          _id: { $ne: id },
        });
        if (taken) {
          return res.status(400).json({
            success: false,
            message: "Email already in use.",
          });
        }
        agent.email = emailNorm;
      }
    }

    if (name !== undefined) {
      agent.name = String(name).trim();
    }

    if (mobile !== undefined) {
      const m = String(mobile).trim();
      if (m) {
        const dupMobile = await User.findOne({
          mobile: m,
          _id: { $ne: id },
        });
        if (dupMobile) {
          return res.status(400).json({
            success: false,
            message: "Mobile already in use.",
          });
        }
      }
      agent.mobile = m || undefined;
    }

    await agent.save();

    res.json({
      success: true,
      data: {
        _id: agent._id,
        name: agent.name,
        email: agent.email,
        mobile: agent.mobile,
        role: agent.role,
      },
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const deleteAgent = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Invalid agent id." });
  }

  try {
    const agent = await User.findById(id);
    if (!agent || agent.role !== "agent") {
      return res.status(404).json({ success: false, message: "Agent not found." });
    }

    await User.deleteOne({ _id: id });

    res.json({ success: true, message: "Agent deleted." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
