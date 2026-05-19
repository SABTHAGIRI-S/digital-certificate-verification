const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  const CertificateVerification = await ethers.getContractFactory("CertificateVerification");
  const contract = await CertificateVerification.deploy();
  await contract.deployed();

  console.log("✅ CertificateVerification deployed to:", contract.address);
  console.log("📋 Save this address in your .env files!");

  // Save ABI + address for frontend & backend
  const fs = require("fs");
  const artifact = await artifacts.readArtifact("CertificateVerification");

  const deploymentInfo = {
    address: contract.address,
    network: hre.network.name,
    deployer: deployer.address,
    abi: artifact.abi,
  };

  fs.writeFileSync(
    "../backend/contractInfo.json",
    JSON.stringify(deploymentInfo, null, 2)
  );
  fs.writeFileSync(
    "../frontend/src/contractInfo.json",
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log("📄 contractInfo.json saved to backend/ and frontend/src/");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
