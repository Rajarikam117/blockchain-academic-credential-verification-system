/**
 * Alternative compilation script that uses solc directly
 * This bypasses Hardhat's lockfile check
 */

const solc = require('solc');
const fs = require('fs');
const path = require('path');

// Read the contract
const contractPath = path.join(__dirname, 'contracts', 'CredentialStorage.sol');
const contractSource = fs.readFileSync(contractPath, 'utf8');

// Prepare input for solc
const input = {
    language: 'Solidity',
    sources: {
        'CredentialStorage.sol': {
            content: contractSource
        }
    },
    settings: {
        outputSelection: {
            '*': {
                '*': ['abi', 'evm.bytecode']
            }
        },
        optimizer: {
            enabled: true,
            runs: 200
        }
    }
};

// Compile
console.log('Compiling contract...');
const output = JSON.parse(solc.compile(JSON.stringify(input)));

// Check for errors
if (output.errors) {
    const errors = output.errors.filter(e => e.severity === 'error');
    if (errors.length > 0) {
        console.error('Compilation errors:');
        errors.forEach(error => console.error(error.formattedMessage));
        process.exit(1);
    }
}

// Create artifacts directory
const artifactsDir = path.join(__dirname, 'artifacts', 'contracts', 'CredentialStorage.sol');
if (!fs.existsSync(artifactsDir)) {
    fs.mkdirSync(artifactsDir, { recursive: true });
}

// Write artifact
const artifact = {
    contractName: 'CredentialStorage',
    abi: output.contracts['CredentialStorage.sol'].CredentialStorage.abi,
    bytecode: output.contracts['CredentialStorage.sol'].CredentialStorage.evm.bytecode.object
};

fs.writeFileSync(
    path.join(artifactsDir, 'CredentialStorage.json'),
    JSON.stringify(artifact, null, 2)
);

console.log('Contract compiled successfully!');
console.log('Artifact saved to:', path.join(artifactsDir, 'CredentialStorage.json'));

