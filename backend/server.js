require("dotenv").config();
const express    = require("express");
const cors       = require("cors");
const mongoose   = require("mongoose");

const authRoutes        = require("./routes/auth.routes");
const certificateRoutes = require("./routes/certificate.routes");
const verifyRoutes      = require("./routes/verify.routes");
const instituteRoutes   = require("./routes/institute.routes");

const app  = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use("/api/auth",        authRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/verify",      verifyRoutes);
app.use("/api/institute",   instituteRoutes);

app.get("/", (req, res) => res.json({ message: "Blockchain Certificate API running ✅" }));

// ─── Error Handler ────────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: err.message || "Server Error" });
});

// ─── Database + Server Start ──────────────────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.error("❌ MongoDB error:", err));
