const express  = require("express");
const router   = express.Router();
const upload   = require("../middleware/upload.middleware");
const { protect, authorize, requireApproved } = require("../middleware/auth.middleware");
const {
  issueCertificate,
  getMyCertificates,
  getIssuedCertificates,
  getCertificateById,
  revokeCertificate,
} = require("../controllers/certificate.controller");

// Institute issues a certificate
router.post("/issue",
  protect,
  authorize("institute"),
  requireApproved,
  upload.single("certificate"),
  issueCertificate
);

// Student: view own certificates
router.get("/my", protect, authorize("student"), getMyCertificates);

// Institute: view all issued
router.get("/issued", protect, authorize("institute"), getIssuedCertificates);

// Anyone with token: view by ID
router.get("/:certId", protect, getCertificateById);

// Institute revokes
router.patch("/:certId/revoke", protect, authorize("institute"), revokeCertificate);

module.exports = router;
