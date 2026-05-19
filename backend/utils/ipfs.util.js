const axios    = require("axios");
const FormData = require("form-data");

const PINATA_BASE = "https://api.pinata.cloud";

/**
 * Upload a file buffer to IPFS via Pinata
 * @param {Buffer} buffer   - file buffer
 * @param {string} filename - original filename
 * @returns {object} { cid, ipfsUrl }
 */
exports.uploadToIPFS = async (buffer, filename) => {
  const form = new FormData();
  form.append("file", buffer, { filename });
  form.append(
    "pinataMetadata",
    JSON.stringify({ name: filename, keyvalues: { project: "blockchain-cert" } })
  );
  form.append("pinataOptions", JSON.stringify({ cidVersion: 0 }));

  const response = await axios.post(`${PINATA_BASE}/pinning/pinFileToIPFS`, form, {
    maxBodyLength: Infinity,
    headers: {
      ...form.getHeaders(),
      pinata_api_key:    process.env.PINATA_API_KEY,
      pinata_secret_api_key: process.env.PINATA_SECRET_KEY,
    },
  });

  const cid = response.data.IpfsHash;
  return {
    cid,
    ipfsUrl: `https://gateway.pinata.cloud/ipfs/${cid}`,
  };
};

/**
 * Retrieve file buffer from IPFS
 */
exports.getFromIPFS = async (cid) => {
  const response = await axios.get(`https://gateway.pinata.cloud/ipfs/${cid}`, {
    responseType: "arraybuffer",
  });
  return Buffer.from(response.data);
};
