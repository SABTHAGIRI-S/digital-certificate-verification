const mongoose = require("mongoose");

const CertificateSchema = new mongoose.Schema(
  {
    certId:          { type: String, required: true, unique: true },
    studentName:     { type: String, required: true },
    studentEmail:    { type: String, required: true },
    studentWallet:   { type: String, default: "" },
    courseName:      { type: String, required: true },
    grade:           { type: String, default: "" },
    issueDate:       { type: Date,   required: true },
    instituteId:     { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    instituteName:   { type: String, required: true },
    // Blockchain & IPFS
    ipfsCID:         { type: String, required: true },
    ipfsUrl:         { type: String, required: true },
    certHash:        { type: String, required: true }, // SHA-256 hex
    txHash:          { type: String, default: "" },    // blockchain tx
    blockNumber:     { type: Number, default: 0 },
    // Status
    isRevoked:       { type: Boolean, default: false },
    revokedAt:       { type: Date,    default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Certificate", CertificateSchema);
