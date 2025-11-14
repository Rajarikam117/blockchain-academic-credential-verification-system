const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("Deploying CredentialStorage contract...");

  // Get contract factory
  const CredentialStorage = await hre.ethers.getContractFactory("CredentialStorage");

  // Deploy contract
  const credentialStorage = await CredentialStorage.deploy();

  // Wait for deployment to complete
  await credentialStorage.waitForDeployment();

  // Get deployed address
  const address = await credentialStorage.getAddress();
  console.log("✅ CredentialStorage deployed to:", address);

  // Path to .env
  const envPath = path.join(__dirname, "..", ".env");

  // Read .env or .env.example
  let envContent = "";
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, "utf8");
  } else {
    const envExamplePath = path.join(__dirname, "..", ".env.example");
    if (fs.existsSync(envExamplePath)) {
      envContent = fs.readFileSync(envExamplePath, "utf8");
    }
  }

  // Update or add CONTRACT_ADDRESS
  if (envContent.includes("CONTRACT_ADDRESS=")) {
    envContent = envContent.replace(/CONTRACT_ADDRESS=.*/, `CONTRACT_ADDRESS=${address}`);
  } else {
    envContent += `\nCONTRACT_ADDRESS=${address}\n`;
  }

  // Save updated .env
  fs.writeFileSync(envPath, envContent);
  console.log("💾 Contract address saved to .env file");
  console.log("\n➡️ Please restart your server after updating .env.");
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exit(1);
});
