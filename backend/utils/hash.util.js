const crypto = require("crypto");

/**
 * Generate SHA-256 hash of a buffer
 * @param {Buffer} buffer
 * @returns {string} hex string
 */
exports.hashBuffer = (buffer) => {
  return crypto.createHash("sha256").update(buffer).digest("hex");
};

/**
 * Generate SHA-256 hash of a string
 */
exports.hashString = (str) => {
  return crypto.createHash("sha256").update(str).digest("hex");
};
