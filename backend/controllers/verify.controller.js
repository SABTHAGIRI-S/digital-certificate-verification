const Certificate             = require("../models/Certificate.model");
const { hashBuffer }          = require("../utils/hash.util");
const { verifyCertOnChain }   = require("../utils/blockchain.util");

/**
 * POST /api/verify/upload
 * Employer uploads a certificate PDF → system checks if it's real or fake
 */
exports.verifyByUpload = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "PDF file required" });

    const { certId } = req.body;
    if (!certId) return res.status(400).json({ success: false, message: "Certificate ID required" });

    // 1. Hash the uploaded file
    const uploadedHash = hashBuffer(req.file.buffer);

    // 2. Find in MongoDB
    const certInDB = await Certificate.findOne({ certId });
    if (!certInDB) {
      return res.json({
        success: true,
        result: "FAKE",
        reason: "Certificate ID not found in system",
        details: null,
      });
    }

    // 3. Cross-check hash with blockchain
    const { isValid, isRevoked, cert: onChainCert } = await verifyCertOnChain(certId, uploadedHash);

    if (isRevoked) {
      return res.json({
        success: true,
        result: "REVOKED",
        reason: "This certificate has been revoked by the issuing institution",
        details: certInDB,
      });
    }

    if (!isValid) {
      return res.json({
        success: true,
        result: "FAKE",
        reason: "Certificate hash does not match blockchain record — document has been tampered",
        details: {
          certId,
          instituteName: certInDB.instituteName,
          studentName:   certInDB.studentName,
        },
      });
    }

    // All good
    return res.json({
      success: true,
      result: "VERIFIED",
      reason: "Certificate is authentic and matches blockchain record",
      details: certInDB,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * GET /api/verify/:certId
 * Quick lookup by certificate ID (no file needed)
 */
exports.verifyById = async (req, res) => {
  try {
    const cert = await Certificate.findOne({ certId: req.params.certId });
    if (!cert) {
      return res.json({ success: true, result: "NOT_FOUND", details: null });
    }
    const status = cert.isRevoked ? "REVOKED" : "FOUND";
    res.json({ success: true, result: status, details: cert });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
