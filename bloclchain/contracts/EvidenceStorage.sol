// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title EvidenceStorage
 * @dev Smart contract for storing and verifying evidence hashes on Polygon blockchain.
 * Stores immutable evidence records with SHA-256 hash, timestamp, and metadata.
 * Emits events for tamper-proof auditing. Verification checks hash integrity.
 */
contract EvidenceStorage is Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _evidenceIdCounter;

    struct EvidenceRecord {
        uint256 id;
        bytes32 evidenceHash; // SHA-256 hash of the evidence file
        uint256 timestamp; // Block timestamp when stored
        string filename; // Original filename
        string metadata; // JSON string with additional info (e.g., fileSize, fileType)
        address owner; // Address that stored the evidence
        bool isVerified; // Flag for verification status
    }

    // Mapping from hash to evidence record (for quick lookup)
    mapping(bytes32 => EvidenceRecord) public evidenceRecords;
    // Mapping from ID to hash (for retrieval by ID)
    mapping(uint256 => bytes32) public idToHash;

    // Events for logging
    event EvidenceStored(
        uint256 indexed id,
        bytes32 indexed evidenceHash,
        uint256 timestamp,
        string filename,
        address indexed owner
    );
    event EvidenceVerified(
        uint256 indexed id,
        bytes32 indexed evidenceHash,
        bool isTampered,
        address indexed verifier
    );
    event AccessLogged(
        bytes32 indexed oldHash,
        bytes32 indexed newHash,
        uint256 timestamp,
        address indexed accessor
    );

    /**
     * @dev Constructor sets the deployer as owner.
     */
    constructor() Ownable() {}

    /**
     * @dev Store a new evidence record on-chain.
     * @param evidenceHash The SHA-256 hash of the evidence file.
     * @param filename The original filename.
     * @param metadata JSON string with file details.
     * Emits EvidenceStored event.
     */
    function storeEvidence(
        bytes32 evidenceHash,
        string memory filename,
        string memory metadata
    ) public returns (uint256) {
        require(evidenceRecords[evidenceHash].id == 0, "Evidence hash already exists");

        _evidenceIdCounter.increment();
        uint256 newId = _evidenceIdCounter.current();

        evidenceRecords[evidenceHash] = EvidenceRecord({
            id: newId,
            evidenceHash: evidenceHash,
            timestamp: block.timestamp,
            filename: filename,
            metadata: metadata,
            owner: msg.sender,
            isVerified: true
        });

        idToHash[newId] = evidenceHash;

        emit EvidenceStored(newId, evidenceHash, block.timestamp, filename, msg.sender);

        return newId;
    }

    /**
     * @dev Retrieve evidence record by hash.
     * @param evidenceHash The SHA-256 hash to lookup.
     * @return The EvidenceRecord struct.
     */
    function getEvidenceByHash(bytes32 evidenceHash) public view returns (EvidenceRecord memory) {
        return evidenceRecords[evidenceHash];
    }

    /**
     * @dev Retrieve evidence record by ID.
     * @param id The evidence ID.
     * @return The EvidenceRecord struct.
     */
    function getEvidenceById(uint256 id) public view returns (EvidenceRecord memory) {
        bytes32 evidenceHash = idToHash[id];
        require(evidenceHash != bytes32(0), "Evidence ID not found");
        return evidenceRecords[evidenceHash];
    }

    /**
     * @dev Verify if a provided hash matches the stored evidence hash (for tamper detection).
     * @param storedHash The hash stored on-chain.
     * @param providedHash The recomputed hash from the file.
     * @return True if hashes match (no tampering), false otherwise.
     * Emits EvidenceVerified event.
     */
    function verifyEvidence(
        bytes32 storedHash,
        bytes32 providedHash
    ) public returns (bool) {
        bool isTampered = (storedHash != providedHash);
        uint256 id = evidenceRecords[storedHash].id;

        // Update verification status
        if (id != 0) {
            evidenceRecords[storedHash].isVerified = !isTampered;
        }

        emit EvidenceVerified(id, storedHash, isTampered, msg.sender);

        return !isTampered;
    }

    /**
     * @dev Get total number of evidence records.
     * @return The counter value.
     */
    function getTotalEvidence() public view returns (uint256) {
        return _evidenceIdCounter.current();
    }

    /**
     * @dev Owner-only function to update metadata if needed (rare use case).
     */
    function updateMetadata(bytes32 evidenceHash, string memory newMetadata) public onlyOwner {
        require(evidenceRecords[evidenceHash].id != 0, "Evidence not found");
        evidenceRecords[evidenceHash].metadata = newMetadata;
    }

    /**
     * @dev Log access to evidence by creating a new hash record with access info.
     * This changes the hash to make it tamper-evident that it was accessed.
     * @param oldHash The current hash of the evidence.
     * @return The new hash after access logging.
     * Emits AccessLogged event.
     */
    function accessEvidence(bytes32 oldHash) public returns (bytes32) {
        require(evidenceRecords[oldHash].id != 0, "Evidence not found");

        EvidenceRecord memory oldRecord = evidenceRecords[oldHash];

        // Compute new hash including access info (oldHash + timestamp + accessor)
        bytes32 newHash = keccak256(abi.encodePacked(oldHash, block.timestamp, msg.sender));

        require(evidenceRecords[newHash].id == 0, "New hash collision - try again");

        _evidenceIdCounter.increment();
        uint256 newId = _evidenceIdCounter.current();

        // Create new record with updated hash
        evidenceRecords[newHash] = EvidenceRecord({
            id: newId,
            evidenceHash: newHash,
            timestamp: block.timestamp,
            filename: oldRecord.filename,
            metadata: oldRecord.metadata,
            owner: oldRecord.owner,
            isVerified: oldRecord.isVerified
        });

        // Update mapping for new ID
        idToHash[newId] = newHash;

        // Remove old record (old ID now invalid)
        delete evidenceRecords[oldHash];

        emit AccessLogged(oldHash, newHash, block.timestamp, msg.sender);

        return newHash;
    }
}
