const multer = require("multer");
const path   = require("path");

const storage = multer.memoryStorage(); // store in memory, then push to IPFS

const fileFilter = (req, file, cb) => {
  const allowed = [".pdf"];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) cb(null, true);
  else cb(new Error("Only PDF files are allowed"), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
});

module.exports = upload;
