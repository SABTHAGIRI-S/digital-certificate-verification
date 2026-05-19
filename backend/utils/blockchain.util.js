const { ethers } = require("ethers");
const contractInfo = require("../contractInfo.json");

let provider, signer, contract;

const init = () => {
  if (contract) return; // already initialized
  provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
  signer   = new ethers.Wallet(process.env.INSTITUTE_PRIVATE_KEY, provider);
  contract = new ethers.Contract(contractInfo.address, contractInfo.abi, signer);
};

/**
 * Issue certificate on blockchain
 */
exports.issueCertOnChain = async ({ certId, certHash, ipfsCID, studentName, courseName, studentWallet }) => {
  init();
  const hashBytes32 = ethers.utils.id(certHash); // convert hex hash to bytes32
  const tx = await contract.issueCertificate(
    certId,
    hashBytes32,
    ipfsCID,
    studentName,
    courseName,
    studentWallet || ethers.constants.AddressZero
  );
  const receipt = await tx.wait();
  return { txHash: receipt.transactionHash, blockNumber: receipt.blockNumber };
};

/**
 * Verify certificate on blockchain
 */
exports.verifyCertOnChain = async (certId, certHash) => {
  init();
  const hashBytes32 = ethers.utils.id(certHash);
  const [isValid, isRevoked, cert] = await contract.verifyCertificate(certId, hashBytes32);
  return { isValid, isRevoked, cert };
};

/**
 * Revoke certificate on blockchain
 */
exports.revokeCertOnChain = async (certId) => {
  init();
  const tx = await contract.revokeCertificate(certId);
  const receipt = await tx.wait();
  return { txHash: receipt.transactionHash };
};

/**
 * Check if an institute is authorized on-chain
 */
exports.isInstituteAuthorized = async (address) => {
  init();
  return await contract.isInstituteAuthorized(address);
};
