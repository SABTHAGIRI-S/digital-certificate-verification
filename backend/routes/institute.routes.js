const express = require("express");
const router  = express.Router();
const { protect, authorize } = require("../middleware/auth.middleware");
const User = require("../models/User.model");

// Admin approves an institute (in prod, this would be a separate admin panel)
router.patch("/:id/approve", protect, authorize("employer"), async (req, res) => {
  // NOTE: In production, replace "employer" with an "admin" role
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );
    res.json({ success: true, message: "Institute approved", data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// List all institutes
router.get("/", protect, async (req, res) => {
  try {
    const institutes = await User.find({ role: "institute" }).select("-password");
    res.json({ success: true, data: institutes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
