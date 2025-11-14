const cron = require('node-cron');
const Database = require('./database');
const BlockchainService = require('./blockchain');
const QRCodeService = require('./qrcode-service');
require('dotenv').config();

class CredentialScheduler {
    constructor() {
        this.db = new Database(process.env.DB_PATH || './credentials.db');
        this.blockchain = new BlockchainService();
        this.qrCodeService = new QRCodeService();
        this.isRunning = false;
    }

    async initialize() {
        try {
            await this.db.connect();
            await this.blockchain.initialize();
            console.log('Scheduler initialized');
        } catch (error) {
            console.error('Error initializing scheduler:', error);
            throw error;
        }
    }

    async processPendingCredentials() {
        if (this.isRunning) {
            console.log('Scheduler is already running, skipping...');
            return;
        }

        this.isRunning = true;
        console.log('Processing pending credentials...');

        try {
            const pendingCredentials = await this.db.getCredentialsPendingBlockchain();
            console.log(`Found ${pendingCredentials.length} credentials to process`);

            for (const credential of pendingCredentials) {
                try {
                    console.log(`Processing credential: ${credential.credentialId}`);

                    // Store on blockchain
                    const txHash = await this.blockchain.storeCredential({
                        credentialId: credential.credentialId,
                        studentName: credential.studentName,
                        institutionName: credential.institutionName,
                        degree: credential.degree,
                        fieldOfStudy: credential.fieldOfStudy,
                        graduationDate: credential.graduationDate
                    });

                    // Generate QR code
                    const verificationUrl = `${process.env.API_URL || 'http://localhost:3000'}/api/verify/${credential.credentialId}`;
                    const qrCodePath = await this.qrCodeService.generateQRCode(
                        credential.credentialId,
                        verificationUrl
                    );

                    // Update database
                    await this.db.updateCredentialToBlockchain(
                        credential.credentialId,
                        txHash,
                        qrCodePath
                    );

                    console.log(`Successfully processed credential: ${credential.credentialId}`);
                } catch (error) {
                    console.error(`Error processing credential ${credential.credentialId}:`, error.message);
                }
            }
        } catch (error) {
            console.error('Error in processPendingCredentials:', error);
        } finally {
            this.isRunning = false;
        }
    }

    start() {
        // Run every hour to check for credentials that need to be moved to blockchain (12-hour wait period)
        cron.schedule('0 * * * *', async () => {
            await this.processPendingCredentials();
        });

        // Also run immediately on start
        this.processPendingCredentials();

        console.log('Scheduler started. Checking for pending credentials every hour (12-hour wait period)...');
    }

    async stop() {
        await this.db.close();
        console.log('Scheduler stopped');
    }
}

// Run scheduler if this file is executed directly
if (require.main === module) {
    const scheduler = new CredentialScheduler();
    scheduler.initialize().then(() => {
        scheduler.start();
    }).catch((error) => {
        console.error('Failed to start scheduler:', error);
        process.exit(1);
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
        console.log('Shutting down scheduler...');
        await scheduler.stop();
        process.exit(0);
    });
}

module.exports = CredentialScheduler;

