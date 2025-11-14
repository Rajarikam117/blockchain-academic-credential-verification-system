const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

class QRCodeService {
    constructor() {
        this.storagePath = process.env.QR_CODE_STORAGE || './qrcodes';
        this.ensureStorageDirectory();
    }

    ensureStorageDirectory() {
        if (!fs.existsSync(this.storagePath)) {
            fs.mkdirSync(this.storagePath, { recursive: true });
        }
    }

    async generateQRCode(credentialId, verificationUrl) {
        try {
            const qrCodeData = {
                credentialId: credentialId,
                verificationUrl: verificationUrl,
                timestamp: new Date().toISOString()
            };

            const qrCodeString = JSON.stringify(qrCodeData);
            const fileName = `credential_${credentialId}_${Date.now()}.png`;
            const filePath = path.join(this.storagePath, fileName);

            await QRCode.toFile(filePath, qrCodeString, {
                errorCorrectionLevel: 'H',
                type: 'png',
                quality: 0.92,
                margin: 1,
                color: {
                    dark: '#000000',
                    light: '#FFFFFF'
                },
                width: 300
            });

            console.log('QR Code generated:', filePath);
            return filePath;
        } catch (error) {
            console.error('Error generating QR code:', error);
            throw error;
        }
    }

    async generateQRCodeDataURL(credentialId, verificationUrl) {
        try {
            const qrCodeData = {
                credentialId: credentialId,
                verificationUrl: verificationUrl,
                timestamp: new Date().toISOString()
            };

            const qrCodeString = JSON.stringify(qrCodeData);
            const dataURL = await QRCode.toDataURL(qrCodeString, {
                errorCorrectionLevel: 'H',
                type: 'image/png',
                quality: 0.92,
                margin: 1,
                color: {
                    dark: '#000000',
                    light: '#FFFFFF'
                },
                width: 300
            });

            return dataURL;
        } catch (error) {
            console.error('Error generating QR code data URL:', error);
            throw error;
        }
    }

    getQRCodePath(fileName) {
        return path.join(this.storagePath, fileName);
    }
}

module.exports = QRCodeService;

