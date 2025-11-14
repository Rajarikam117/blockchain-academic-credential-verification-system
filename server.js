const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const Database = require('./database');
const BlockchainService = require('./blockchain');
const QRCodeService = require('./qrcode-service');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize services
const db = new Database(process.env.DB_PATH || './credentials.db');
const blockchain = new BlockchainService();
const qrCodeService = new QRCodeService();

// Middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// CORS middleware already handles OPTIONS requests, but we can add explicit handling if needed
// The cors() middleware should handle this automatically

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize database and blockchain
let dbInitialized = false;
let blockchainInitialized = false;

async function initializeServices() {
    try {
        await db.connect();
        dbInitialized = true;
        console.log('Database initialized');

        try {
            await blockchain.initialize();
            blockchainInitialized = true;
            console.log('Blockchain service initialized');
        } catch (error) {
            console.warn('Blockchain service not available:', error.message);
            console.warn('Credentials will be stored in database only until blockchain is available');
        }
    } catch (error) {
        console.error('Error initializing services:', error);
        process.exit(1);
    }
}

// API Routes (must come BEFORE static files)

// Add request logging for debugging (remove in production)
if (process.env.NODE_ENV !== 'production') {
    app.use('/api', (req, res, next) => {
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
        next();
    });
}

// Submit a new credential
app.post('/api/credentials', async (req, res) => {
    try {
        const { studentName, institutionName, degree, fieldOfStudy, graduationDate } = req.body;

        if (!studentName || !institutionName || !degree || !fieldOfStudy || !graduationDate) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        const credentialId = uuidv4();
        const credential = {
            credentialId,
            studentName,
            institutionName,
            degree,
            fieldOfStudy,
            graduationDate
        };

        // Store in database (will be moved to blockchain after 12 hours)
        const savedCredential = await db.insertCredential(credential);

        res.status(201).json({
            success: true,
            message: 'Credential submitted successfully. It will be stored on blockchain after 12 hours.',
            credential: {
                credentialId: savedCredential.credentialId,
                studentName: savedCredential.studentName,
                institutionName: savedCredential.institutionName,
                degree: savedCredential.degree,
                fieldOfStudy: savedCredential.fieldOfStudy,
                graduationDate: savedCredential.graduationDate,
                status: 'pending',
                message: 'Credential will be stored on blockchain after 12 hours'
            }
        });
    } catch (error) {
        console.error('Error submitting credential:', error);
        res.status(500).json({
            success: false,
            message: 'Error submitting credential',
            error: error.message
        });
    }
});

// Get all credentials
app.get('/api/credentials', async (req, res) => {
    try {
        const credentials = await db.getAllCredentials();
        res.json({
            success: true,
            credentials
        });
    } catch (error) {
        console.error('Error fetching credentials:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching credentials',
            error: error.message
        });
    }
});

// Get credential by ID
app.get('/api/credentials/:credentialId', async (req, res) => {
    try {
        const { credentialId } = req.params;
        const credential = await db.getCredentialById(credentialId);

        if (!credential) {
            return res.status(404).json({
                success: false,
                message: 'Credential not found'
            });
        }

        // If on blockchain, get blockchain data
        if (credential.onBlockchain && blockchainInitialized) {
            try {
                const blockchainData = await blockchain.getCredential(credentialId);
                credential.blockchainData = blockchainData;
            } catch (error) {
                console.error('Error fetching blockchain data:', error);
            }
        }

        res.json({
            success: true,
            credential
        });
    } catch (error) {
        console.error('Error fetching credential:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching credential',
            error: error.message
        });
    }
});

// Update credential
app.put('/api/credentials/:credentialId', async (req, res) => {
    try {
        const { credentialId } = req.params;
        const { studentName, institutionName, degree, fieldOfStudy, graduationDate } = req.body;

        if (!studentName || !institutionName || !degree || !fieldOfStudy || !graduationDate) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        const updates = {
            studentName,
            institutionName,
            degree,
            fieldOfStudy,
            graduationDate
        };

        await db.updateCredential(credentialId, updates);
        const updatedCredential = await db.getCredentialById(credentialId);

        res.json({
            success: true,
            message: 'Credential updated successfully',
            credential: updatedCredential
        });
    } catch (error) {
        console.error('Error updating credential:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error updating credential',
            error: error.message
        });
    }
});

// Verify credential
app.get('/api/verify/:credentialId', async (req, res) => {
    try {
        const { credentialId } = req.params;

        // Check database first
        const dbCredential = await db.getCredentialById(credentialId);

        if (!dbCredential) {
            return res.status(404).json({
                success: false,
                verified: false,
                message: 'Credential not found'
            });
        }

        // If on blockchain, verify on blockchain
        if (dbCredential.onBlockchain && blockchainInitialized) {
            try {
                const isVerified = await blockchain.verifyCredential(credentialId);
                const blockchainData = await blockchain.getCredential(credentialId);

                return res.json({
                    success: true,
                    verified: isVerified,
                    credential: {
                        credentialId: dbCredential.credentialId,
                        studentName: dbCredential.studentName,
                        institutionName: dbCredential.institutionName,
                        degree: dbCredential.degree,
                        fieldOfStudy: dbCredential.fieldOfStudy,
                        graduationDate: dbCredential.graduationDate,
                        blockchainTxHash: dbCredential.blockchainTxHash,
                        qrCodePath: dbCredential.qrCodePath,
                        blockchainData: blockchainData
                    }
                });
            } catch (error) {
                console.error('Error verifying on blockchain:', error);
            }
        }

        // Return database credential (pending blockchain storage)
        res.json({
            success: true,
            verified: false,
            credential: {
                credentialId: dbCredential.credentialId,
                studentName: dbCredential.studentName,
                institutionName: dbCredential.institutionName,
                degree: dbCredential.degree,
                fieldOfStudy: dbCredential.fieldOfStudy,
                graduationDate: dbCredential.graduationDate,
                status: 'pending',
                message: 'Credential is pending blockchain storage (12-hour wait period)'
            }
        });
    } catch (error) {
        console.error('Error verifying credential:', error);
        res.status(500).json({
            success: false,
            verified: false,
            message: 'Error verifying credential',
            error: error.message
        });
    }
});

// Get QR code for credential
app.get('/api/credentials/:credentialId/qrcode', async (req, res) => {
    try {
        const { credentialId } = req.params;
        const credential = await db.getCredentialById(credentialId);

        if (!credential) {
            return res.status(404).json({
                success: false,
                message: 'Credential not found'
            });
        }

        // If credential is on blockchain and has QR code, return it
        if (credential.onBlockchain && credential.qrCodePath) {
            if (fs.existsSync(credential.qrCodePath)) {
                return res.sendFile(path.resolve(credential.qrCodePath));
            }
        }

        // Generate QR code data URL for pending credentials
        const verificationUrl = `${req.protocol}://${req.get('host')}/api/verify/${credentialId}`;
        const qrCodeDataURL = await qrCodeService.generateQRCodeDataURL(credentialId, verificationUrl);

        res.json({
            success: true,
            qrCode: qrCodeDataURL,
            credentialId: credentialId,
            status: credential.onBlockchain ? 'verified' : 'pending'
        });
    } catch (error) {
        console.error('Error generating QR code:', error);
        res.status(500).json({
            success: false,
            message: 'Error generating QR code',
            error: error.message
        });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        database: dbInitialized ? 'connected' : 'disconnected',
        blockchain: blockchainInitialized ? 'connected' : 'disconnected',
        timestamp: new Date().toISOString()
    });
});

// OPTIONS requests are handled by the cors() middleware above
// No need for explicit OPTIONS handler

// 404 handler for unmatched API routes (must be after all API routes, before static files)
app.use((req, res, next) => {
    if (req.path.startsWith('/api/')) {
        return res.status(404).json({
            success: false,
            message: 'API endpoint not found',
            method: req.method,
            path: req.path,
            availableEndpoints: [
                'GET /api/health',
                'GET /api/credentials',
                'POST /api/credentials',
                'GET /api/credentials/:id',
                'PUT /api/credentials/:id',
                'GET /api/verify/:id',
                'GET /api/credentials/:id/qrcode'
            ]
        });
    }
    next();
});

// Static files (must come AFTER API routes)
app.use('/qrcodes', express.static('qrcodes'));
app.use(express.static('public'));

// Error handling middleware (must be last)
app.use((err, req, res, next) => {
    console.error('Error:', err);
    // Only send JSON for API routes
    if (req.path.startsWith('/api/')) {
        return res.status(err.status || 500).json({
            success: false,
            message: err.message || 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
    }
    // For non-API routes, send HTML error page or redirect
    res.status(err.status || 500).send(`Error: ${err.message || 'Internal server error'}`);
});

// Start server
initializeServices().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`API available at http://localhost:${PORT}/api`);
        console.log(`Health check: http://localhost:${PORT}/api/health`);
    });
}).catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
});

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('Shutting down server...');
    await db.close();
    process.exit(0);
});

module.exports = app;

