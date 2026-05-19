const express = require("express");
const router  = express.Router();
const upload  = require("../middleware/upload.middleware");
const { verifyByUpload, verifyById } = require("../controllers/verify.controller");

// Public routes — no auth needed for verification
router.post("/upload", upload.single("certificate"), verifyByUpload);
router.get("/:certId", verifyById);

module.exports = router;
