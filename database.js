const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

class Database {
    constructor(dbPath) {
        this.dbPath = dbPath;
        this.db = null;
    }

    connect() {
        return new Promise((resolve, reject) => {
            // Ensure directory exists
            const dir = path.dirname(this.dbPath);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }

            this.db = new sqlite3.Database(this.dbPath, (err) => {
                if (err) {
                    console.error('Error opening database:', err);
                    reject(err);
                } else {
                    console.log('Connected to SQLite database');
                    this.initializeTables().then(resolve).catch(reject);
                }
            });
        });
    }

    initializeTables() {
        return new Promise((resolve, reject) => {
            const createTableQuery = `
                CREATE TABLE IF NOT EXISTS credentials (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    credentialId TEXT UNIQUE NOT NULL,
                    studentName TEXT NOT NULL,
                    institutionName TEXT NOT NULL,
                    degree TEXT NOT NULL,
                    fieldOfStudy TEXT NOT NULL,
                    graduationDate TEXT NOT NULL,
                    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                    blockchainTxHash TEXT,
                    qrCodePath TEXT,
                    onBlockchain INTEGER DEFAULT 0,
                    UNIQUE(credentialId)
                )
            `;

            this.db.run(createTableQuery, (err) => {
                if (err) {
                    console.error('Error creating table:', err);
                    reject(err);
                } else {
                    console.log('Database tables initialized');
                    resolve();
                }
            });
        });
    }

    insertCredential(credential) {
        return new Promise((resolve, reject) => {
            const query = `
                INSERT INTO credentials 
                (credentialId, studentName, institutionName, degree, fieldOfStudy, graduationDate)
                VALUES (?, ?, ?, ?, ?, ?)
            `;

            this.db.run(
                query,
                [
                    credential.credentialId,
                    credential.studentName,
                    credential.institutionName,
                    credential.degree,
                    credential.fieldOfStudy,
                    credential.graduationDate
                ],
                function(err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve({ id: this.lastID, ...credential });
                    }
                }
            );
        });
    }

    getCredentialsPendingBlockchain() {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT * FROM credentials 
                WHERE onBlockchain = 0 
                AND datetime(createdAt) <= datetime('now', '-12 hours')
            `;

            this.db.all(query, [], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    updateCredentialToBlockchain(credentialId, txHash, qrCodePath) {
        return new Promise((resolve, reject) => {
            const query = `
                UPDATE credentials 
                SET onBlockchain = 1, blockchainTxHash = ?, qrCodePath = ?
                WHERE credentialId = ?
            `;

            this.db.run(query, [txHash, qrCodePath, credentialId], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ changes: this.changes });
                }
            });
        });
    }

    updateCredential(credentialId, updates) {
        return new Promise((resolve, reject) => {
            // Only allow updating if not on blockchain
            const checkQuery = `SELECT onBlockchain FROM credentials WHERE credentialId = ?`;
            
            this.db.get(checkQuery, [credentialId], (err, row) => {
                if (err) {
                    reject(err);
                    return;
                }

                if (!row) {
                    reject(new Error('Credential not found'));
                    return;
                }

                if (row.onBlockchain === 1) {
                    reject(new Error('Cannot edit credential that is already on blockchain'));
                    return;
                }

                const fields = [];
                const values = [];

                if (updates.studentName !== undefined) {
                    fields.push('studentName = ?');
                    values.push(updates.studentName);
                }
                if (updates.institutionName !== undefined) {
                    fields.push('institutionName = ?');
                    values.push(updates.institutionName);
                }
                if (updates.degree !== undefined) {
                    fields.push('degree = ?');
                    values.push(updates.degree);
                }
                if (updates.fieldOfStudy !== undefined) {
                    fields.push('fieldOfStudy = ?');
                    values.push(updates.fieldOfStudy);
                }
                if (updates.graduationDate !== undefined) {
                    fields.push('graduationDate = ?');
                    values.push(updates.graduationDate);
                }

                if (fields.length === 0) {
                    reject(new Error('No fields to update'));
                    return;
                }

                values.push(credentialId);
                const query = `UPDATE credentials SET ${fields.join(', ')} WHERE credentialId = ?`;

                this.db.run(query, values, function(err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve({ changes: this.changes });
                    }
                });
            });
        });
    }

    getCredentialById(credentialId) {
        return new Promise((resolve, reject) => {
            const query = `SELECT * FROM credentials WHERE credentialId = ?`;

            this.db.get(query, [credentialId], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
            });
    }

    getAllCredentials() {
        return new Promise((resolve, reject) => {
            const query = `SELECT * FROM credentials ORDER BY createdAt DESC`;

            this.db.all(query, [], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    close() {
        return new Promise((resolve, reject) => {
            if (this.db) {
                this.db.close((err) => {
                    if (err) {
                        reject(err);
                    } else {
                        console.log('Database connection closed');
                        resolve();
                    }
                });
            } else {
                resolve();
            }
        });
    }
}

module.exports = Database;

