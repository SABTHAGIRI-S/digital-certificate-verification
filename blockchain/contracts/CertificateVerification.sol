// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title CertificateVerification
 * @dev Blockchain-based certificate issuance and verification system
 */
contract CertificateVerification is Ownable {

    // ─── Structs ───────────────────────────────────────────────────────────────

    struct Certificate {
        bytes32  certHash;        // SHA-256 hash of the certificate file
        string   ipfsCID;         // IPFS Content ID where the PDF is stored
        string   studentName;
        string   courseName;
        string   instituteName;
        address  instituteAddress;
        uint256  issuedAt;        // Unix timestamp
        bool     isRevoked;
    }

    struct Institute {
        string  name;
        bool    isAuthorized;
        uint256 totalIssued;
    }

    // ─── State Variables ───────────────────────────────────────────────────────

    // certId → Certificate
    mapping(string => Certificate) private certificates;

    // institute wallet address → Institute info
    mapping(address => Institute) public institutes;

    // studentAddress → list of certIds
    mapping(address => string[]) private studentCertificates;

    // track all certIds
    string[] public allCertificateIds;

    // ─── Events ────────────────────────────────────────────────────────────────

    event InstituteAuthorized(address indexed institute, string name);
    event InstituteRevoked(address indexed institute);
    event CertificateIssued(
        string  indexed certId,
        address indexed institute,
        address indexed student,
        bytes32 certHash,
        string  ipfsCID,
        uint256 issuedAt
    );
    event CertificateRevoked(string indexed certId, address indexed revokedBy);

    // ─── Modifiers ─────────────────────────────────────────────────────────────

    modifier onlyAuthorizedInstitute() {
        require(institutes[msg.sender].isAuthorized, "Not an authorized institute");
        _;
    }

    modifier certificateExists(string memory certId) {
        require(certificates[certId].issuedAt != 0, "Certificate does not exist");
        _;
    }

    // ─── Institute Management (Owner only) ────────────────────────────────────

    function authorizeInstitute(address _institute, string memory _name) external onlyOwner {
        require(_institute != address(0), "Invalid address");
        institutes[_institute] = Institute({
            name: _name,
            isAuthorized: true,
            totalIssued: 0
        });
        emit InstituteAuthorized(_institute, _name);
    }

    function revokeInstitute(address _institute) external onlyOwner {
        institutes[_institute].isAuthorized = false;
        emit InstituteRevoked(_institute);
    }

    // ─── Certificate Issuance ─────────────────────────────────────────────────

    /**
     * @dev Issue a new certificate on-chain
     * @param certId       Unique certificate ID (UUID generated off-chain)
     * @param certHash     SHA-256 hash of the certificate PDF (bytes32)
     * @param ipfsCID      IPFS CID of the stored PDF
     * @param studentName  Name of the student
     * @param courseName   Name of the course/degree
     * @param studentAddr  Wallet address of the student
     */
    function issueCertificate(
        string  memory certId,
        bytes32        certHash,
        string  memory ipfsCID,
        string  memory studentName,
        string  memory courseName,
        address        studentAddr
    ) external onlyAuthorizedInstitute {
        require(bytes(certId).length > 0,      "Empty certId");
        require(certHash != bytes32(0),         "Empty hash");
        require(bytes(ipfsCID).length > 0,     "Empty IPFS CID");
        require(certificates[certId].issuedAt == 0, "Certificate ID already exists");

        certificates[certId] = Certificate({
            certHash:         certHash,
            ipfsCID:          ipfsCID,
            studentName:      studentName,
            courseName:       courseName,
            instituteName:    institutes[msg.sender].name,
            instituteAddress: msg.sender,
            issuedAt:         block.timestamp,
            isRevoked:        false
        });

        institutes[msg.sender].totalIssued++;
        studentCertificates[studentAddr].push(certId);
        allCertificateIds.push(certId);

        emit CertificateIssued(certId, msg.sender, studentAddr, certHash, ipfsCID, block.timestamp);
    }

    // ─── Certificate Verification ─────────────────────────────────────────────

    /**
     * @dev Verify a certificate by its ID and hash
     * @return isValid    true if hash matches and cert is not revoked
     * @return isRevoked  true if certificate was revoked
     * @return cert       full certificate struct
     */
    function verifyCertificate(string memory certId, bytes32 certHash)
        external
        view
        certificateExists(certId)
        returns (
            bool isValid,
            bool isRevoked,
            Certificate memory cert
        )
    {
        cert      = certificates[certId];
        isRevoked = cert.isRevoked;
        isValid   = (!cert.isRevoked) && (cert.certHash == certHash);
    }

    /**
     * @dev Get certificate details by ID (no hash check)
     */
    function getCertificate(string memory certId)
        external
        view
        certificateExists(certId)
        returns (Certificate memory)
    {
        return certificates[certId];
    }

    /**
     * @dev Get all certificate IDs for a student
     */
    function getStudentCertificates(address studentAddr)
        external
        view
        returns (string[] memory)
    {
        return studentCertificates[studentAddr];
    }

    // ─── Revocation ───────────────────────────────────────────────────────────

    function revokeCertificate(string memory certId)
        external
        certificateExists(certId)
    {
        Certificate storage cert = certificates[certId];
        require(
            msg.sender == cert.instituteAddress || msg.sender == owner(),
            "Not authorized to revoke"
        );
        require(!cert.isRevoked, "Already revoked");
        cert.isRevoked = true;
        emit CertificateRevoked(certId, msg.sender);
    }

    // ─── Helpers ──────────────────────────────────────────────────────────────

    function getTotalCertificates() external view returns (uint256) {
        return allCertificateIds.length;
    }

    function isInstituteAuthorized(address _institute) external view returns (bool) {
        return institutes[_institute].isAuthorized;
    }
}
