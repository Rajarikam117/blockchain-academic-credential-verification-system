const { Web3 } = require('web3');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

class BlockchainService {
    constructor() {
        this.web3 = null;
        this.contract = null;
        this.account = null;
        this.contractAddress = process.env.CONTRACT_ADDRESS || '';
    }

    async initialize() {
        try {
            // Connect to local blockchain (Hardhat node)
            const providerUrl = process.env.BLOCKCHAIN_NETWORK || 'http://localhost:8545';
            this.web3 = new Web3(providerUrl);

            // Check connection
            try {
                const blockNumber = await this.web3.eth.getBlockNumber();
                console.log('Connected to blockchain network:', providerUrl);
                console.log('Current block number:', blockNumber);
            } catch (error) {
                throw new Error('Cannot connect to blockchain network. Make sure Hardhat node is running.');
            }

            // Load contract ABI
            const contractPath = path.join(__dirname, 'artifacts', 'contracts', 'CredentialStorage.sol', 'CredentialStorage.json');
            
            if (!fs.existsSync(contractPath)) {
                throw new Error('Contract artifacts not found. Please compile the contract first using: npm run compile');
            }

            const contractJson = JSON.parse(fs.readFileSync(contractPath, 'utf8'));
            const contractABI = contractJson.abi;

            // Set up contract instance
            if (this.contractAddress) {
                this.contract = new this.web3.eth.Contract(contractABI, this.contractAddress);
                console.log('Contract instance created at:', this.contractAddress);
            } else {
                console.warn('Contract address not set. Please deploy the contract first.');
            }

            // Set up account if private key is provided
            if (process.env.PRIVATE_KEY) {
                const privateKey = process.env.PRIVATE_KEY.startsWith('0x') 
                    ? process.env.PRIVATE_KEY 
                    : '0x' + process.env.PRIVATE_KEY;
                this.account = this.web3.eth.accounts.privateKeyToAccount(privateKey);
                this.web3.eth.accounts.wallet.add(this.account);
                console.log('Account initialized:', this.account.address);
            }

        } catch (error) {
            console.error('Error initializing blockchain service:', error.message);
            throw error;
        }
    }

    async storeCredential(credential) {
        if (!this.contract) {
            throw new Error('Contract not initialized. Please deploy the contract first.');
        }

        if (!this.account) {
            throw new Error('Account not initialized. Please set PRIVATE_KEY in .env');
        }

        try {
            const gasEstimate = await this.contract.methods
                .storeCredential(
                    credential.credentialId,
                    credential.studentName,
                    credential.institutionName,
                    credential.degree,
                    credential.fieldOfStudy,
                    credential.graduationDate
                )
                .estimateGas({ from: this.account.address });

            const transaction = await this.contract.methods
                .storeCredential(
                    credential.credentialId,
                    credential.studentName,
                    credential.institutionName,
                    credential.degree,
                    credential.fieldOfStudy,
                    credential.graduationDate
                )
                .send({
                    from: this.account.address,
                    gas: gasEstimate,
                    gasPrice: await this.web3.eth.getGasPrice()
                });

            console.log('Credential stored on blockchain. Transaction hash:', transaction.transactionHash);
            return transaction.transactionHash;
        } catch (error) {
            console.error('Error storing credential on blockchain:', error);
            throw error;
        }
    }

    async verifyCredential(credentialId) {
        if (!this.contract) {
            throw new Error('Contract not initialized');
        }

        try {
            const result = await this.contract.methods.verifyCredential(credentialId).call();
            return result;
        } catch (error) {
            console.error('Error verifying credential:', error);
            return false;
        }
    }

    async getCredential(credentialId) {
        if (!this.contract) {
            throw new Error('Contract not initialized');
        }

        try {
            const result = await this.contract.methods.getCredential(credentialId).call();
            return {
                studentName: result[0],
                institutionName: result[1],
                degree: result[2],
                fieldOfStudy: result[3],
                graduationDate: result[4],
                timestamp: result[5],
                verified: result[6]
            };
        } catch (error) {
            console.error('Error getting credential:', error);
            throw error;
        }
    }

    setContractAddress(address) {
        this.contractAddress = address;
        if (this.web3 && this.contract) {
            const contractPath = path.join(__dirname, 'artifacts', 'contracts', 'CredentialStorage.sol', 'CredentialStorage.json');
            const contractJson = JSON.parse(fs.readFileSync(contractPath, 'utf8'));
            const contractABI = contractJson.abi;
            this.contract = new this.web3.eth.Contract(contractABI, address);
        }
    }
}

module.exports = BlockchainService;

