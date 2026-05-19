const jwt  = require("jsonwebtoken");
const User = require("../models/User.model");

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

exports.register = async (req, res) => {
  try {
    const { name, email, password, role, instituteName, walletAddress } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ success: false, message: "Email already registered" });

    const user = await User.create({
      name,
      email,
      password,
      role,
      instituteName: role === "institute" ? instituteName : "",
      walletAddress: walletAddress || "",
      isApproved: role !== "institute", // students & employers auto-approved
    });

    const token = signToken(user._id);
    res.status(201).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, isApproved: user.isApproved },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = signToken(user._id);
    res.json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, isApproved: user.isApproved },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getMe = async (req, res) => {
  res.json({ success: true, user: req.user });
};

exports.updateWallet = async (req, res) => {
  try {
    const { walletAddress } = req.body;
    await User.findByIdAndUpdate(req.user._id, { walletAddress });
    res.json({ success: true, message: "Wallet updated" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
