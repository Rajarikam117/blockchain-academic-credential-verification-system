// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CredentialStorage {
    struct Credential {
        string credentialId;
        string studentName;
        string institutionName;
        string degree;
        string fieldOfStudy;
        string graduationDate;
        uint256 timestamp;
        bool verified;
    }

    mapping(string => Credential) public credentials;
    mapping(string => bool) public credentialExists;
    string[] public credentialIds;

    address public owner;

    event CredentialStored(
        string indexed credentialId,
        string studentName,
        string institutionName,
        uint256 timestamp
    );

    event CredentialVerified(string indexed credentialId, bool verified);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function storeCredential(
        string memory _credentialId,
        string memory _studentName,
        string memory _institutionName,
        string memory _degree,
        string memory _fieldOfStudy,
        string memory _graduationDate
    ) public onlyOwner {
        require(!credentialExists[_credentialId], "Credential ID already exists");

        credentials[_credentialId] = Credential({
            credentialId: _credentialId,
            studentName: _studentName,
            institutionName: _institutionName,
            degree: _degree,
            fieldOfStudy: _fieldOfStudy,
            graduationDate: _graduationDate,
            timestamp: block.timestamp,
            verified: true
        });

        credentialExists[_credentialId] = true;
        credentialIds.push(_credentialId);

        emit CredentialStored(_credentialId, _studentName, _institutionName, block.timestamp);
    }

    function getCredential(string memory _credentialId)
        public
        view
        returns (
            string memory studentName,
            string memory institutionName,
            string memory degree,
            string memory fieldOfStudy,
            string memory graduationDate,
            uint256 timestamp,
            bool verified
        )
    {
        require(credentialExists[_credentialId], "Credential does not exist");
        Credential memory cred = credentials[_credentialId];
        return (
            cred.studentName,
            cred.institutionName,
            cred.degree,
            cred.fieldOfStudy,
            cred.graduationDate,
            cred.timestamp,
            cred.verified
        );
    }

    function verifyCredential(string memory _credentialId) public view returns (bool) {
        return credentialExists[_credentialId] && credentials[_credentialId].verified;
    }

    function getTotalCredentials() public view returns (uint256) {
        return credentialIds.length;
    }
}



