const { expect } = require("chai");
const { ethers } = require("hardhat");
const { utils } = ethers;

describe("CertificateVerification", function () {
  let contract, owner, institute, student, employer;

  const CERT_ID   = "CERT-2024-001";
  const CERT_HASH = utils.id("sample-certificate-content"); // fake SHA-256
  const IPFS_CID  = "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco";

  beforeEach(async () => {
    [owner, institute, student, employer] = await ethers.getSigners();
    const Factory = await ethers.getContractFactory("CertificateVerification");
    contract = await Factory.deploy();
    await contract.deployed();
  });

  it("Owner can authorize an institute", async () => {
    await contract.authorizeInstitute(institute.address, "MIT");
    const info = await contract.institutes(institute.address);
    expect(info.isAuthorized).to.be.true;
    expect(info.name).to.equal("MIT");
  });

  it("Authorized institute can issue a certificate", async () => {
    await contract.authorizeInstitute(institute.address, "MIT");
    await contract.connect(institute).issueCertificate(
      CERT_ID, CERT_HASH, IPFS_CID,
      "Alice", "B.Tech Computer Science", student.address
    );
    const cert = await contract.getCertificate(CERT_ID);
    expect(cert.studentName).to.equal("Alice");
    expect(cert.certHash).to.equal(CERT_HASH);
  });

  it("Verification returns true for valid certificate", async () => {
    await contract.authorizeInstitute(institute.address, "MIT");
    await contract.connect(institute).issueCertificate(
      CERT_ID, CERT_HASH, IPFS_CID,
      "Alice", "B.Tech Computer Science", student.address
    );
    const [isValid, isRevoked] = await contract.verifyCertificate(CERT_ID, CERT_HASH);
    expect(isValid).to.be.true;
    expect(isRevoked).to.be.false;
  });

  it("Verification returns false for tampered certificate", async () => {
    await contract.authorizeInstitute(institute.address, "MIT");
    await contract.connect(institute).issueCertificate(
      CERT_ID, CERT_HASH, IPFS_CID,
      "Alice", "B.Tech Computer Science", student.address
    );
    const fakeHash = utils.id("tampered-content");
    const [isValid] = await contract.verifyCertificate(CERT_ID, fakeHash);
    expect(isValid).to.be.false;
  });

  it("Institute can revoke a certificate", async () => {
    await contract.authorizeInstitute(institute.address, "MIT");
    await contract.connect(institute).issueCertificate(
      CERT_ID, CERT_HASH, IPFS_CID,
      "Alice", "B.Tech Computer Science", student.address
    );
    await contract.connect(institute).revokeCertificate(CERT_ID);
    const [isValid, isRevoked] = await contract.verifyCertificate(CERT_ID, CERT_HASH);
    expect(isRevoked).to.be.true;
    expect(isValid).to.be.false;
  });

  it("Unauthorized institute cannot issue certificate", async () => {
    await expect(
      contract.connect(institute).issueCertificate(
        CERT_ID, CERT_HASH, IPFS_CID,
        "Alice", "B.Tech", student.address
      )
    ).to.be.revertedWith("Not an authorized institute");
  });
});
