const { v4: uuidv4 }   = require("uuid");
const Certificate       = require("../models/Certificate.model");
const { uploadToIPFS }  = require("../utils/ipfs.util");
const { hashBuffer }    = require("../utils/hash.util");
const { issueCertOnChain, revokeCertOnChain } = require("../utils/blockchain.util");

// POST /api/certificates/issue
exports.issueCertificate = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "PDF file required" });

    const { studentName, studentEmail, studentWallet, courseName, grade, issueDate } = req.body;
    const buffer   = req.file.buffer;
    const certHash = hashBuffer(buffer);
    const certId   = `CERT-${uuidv4()}`;

    // 1. Upload PDF to IPFS
    const { cid, ipfsUrl } = await uploadToIPFS(buffer, `${certId}.pdf`);

    // 2. Record on blockchain
    const { txHash, blockNumber } = await issueCertOnChain({
      certId,
      certHash,
      ipfsCID: cid,
      studentName,
      courseName,
      studentWallet: studentWallet || "0x0000000000000000000000000000000000000000",
    });

    // 3. Save to MongoDB
    const cert = await Certificate.create({
      certId,
      studentName,
      studentEmail,
      studentWallet: studentWallet || "",
      courseName,
      grade: grade || "",
      issueDate: new Date(issueDate),
      instituteId:   req.user._id,
      instituteName: req.user.instituteName || req.user.name,
      ipfsCID: cid,
      ipfsUrl,
      certHash,
      txHash,
      blockNumber,
    });

    res.status(201).json({ success: true, message: "Certificate issued on blockchain ✅", data: cert });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/certificates/my  (student sees their certs)
exports.getMyCertificates = async (req, res) => {
  try {
    const certs = await Certificate.find({ studentEmail: req.user.email });
    res.json({ success: true, data: certs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/certificates/issued  (institute sees certs they issued)
exports.getIssuedCertificates = async (req, res) => {
  try {
    const certs = await Certificate.find({ instituteId: req.user._id });
    res.json({ success: true, data: certs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/certificates/:certId
exports.getCertificateById = async (req, res) => {
  try {
    const cert = await Certificate.findOne({ certId: req.params.certId });
    if (!cert) return res.status(404).json({ success: false, message: "Certificate not found" });
    res.json({ success: true, data: cert });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PATCH /api/certificates/:certId/revoke
exports.revokeCertificate = async (req, res) => {
  try {
    const cert = await Certificate.findOne({ certId: req.params.certId });
    if (!cert) return res.status(404).json({ success: false, message: "Certificate not found" });
    if (cert.instituteId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not your certificate" });
    }

    await revokeCertOnChain(cert.certId);
    cert.isRevoked = true;
    cert.revokedAt = new Date();
    await cert.save();

    res.json({ success: true, message: "Certificate revoked on blockchain" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
