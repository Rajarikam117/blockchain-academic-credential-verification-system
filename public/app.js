const API_BASE_URL = window.location.origin + '/api';

// Tab switching
function showTab(tabName, eventElement) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    // Remove active class from all buttons
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected tab
    const tabElement = document.getElementById(tabName + '-tab');
    if (tabElement) {
        tabElement.classList.add('active');
    }

    // Activate the button - use eventElement if provided, otherwise find by tab name
    let buttonToActivate = null;
    if (eventElement && eventElement.classList && eventElement.classList.contains('tab-button')) {
        buttonToActivate = eventElement;
    } else {
        // Find button by text content or data attribute
        document.querySelectorAll('.tab-button').forEach(btn => {
            if (btn.textContent.includes(tabName.charAt(0).toUpperCase() + tabName.slice(1)) || 
                btn.getAttribute('data-tab') === tabName) {
                buttonToActivate = btn;
            }
        });
    }
    
    if (buttonToActivate) {
        buttonToActivate.classList.add('active');
    }
}

// Submit credential
document.getElementById('credential-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const resultDiv = document.getElementById('submit-result');
    resultDiv.className = 'result-message';
    resultDiv.textContent = 'Submitting...';

    const formData = {
        studentName: document.getElementById('studentName').value,
        institutionName: document.getElementById('institutionName').value,
        degree: document.getElementById('degree').value,
        fieldOfStudy: document.getElementById('fieldOfStudy').value,
        graduationDate: document.getElementById('graduationDate').value
    };

    try {
        const response = await fetch(`${API_BASE_URL}/credentials`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const contentType = response.headers.get('content-type');
        let data;
        
        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
        } else {
            const text = await response.text();
            throw new Error(`Expected JSON but got: ${contentType}. Response: ${text.substring(0, 100)}`);
        }
        
        if (!response.ok) {
            // If response is not ok, use the parsed JSON error message
            throw new Error(data.message || `Server error: ${response.status}`);
        }

        if (data.success) {
            resultDiv.className = 'result-message success';
            resultDiv.innerHTML = `
                <strong>Success!</strong><br>
                Credential ID: <code>${data.credential.credentialId}</code><br>
                ${data.credential.message}<br>
                <small>Note: Credential will be stored on blockchain after 2 days.</small>
            `;
            document.getElementById('credential-form').reset();
        } else {
            resultDiv.className = 'result-message error';
            resultDiv.textContent = data.message || 'Error submitting credential';
        }
    } catch (error) {
        resultDiv.className = 'result-message error';
        resultDiv.textContent = 'Error: ' + error.message;
    }
});

// Verify credential
document.getElementById('verify-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const resultDiv = document.getElementById('verify-result');
    const qrCodeDiv = document.getElementById('qr-code-display');
    
    resultDiv.className = 'result-message';
    resultDiv.textContent = 'Verifying...';
    qrCodeDiv.innerHTML = '';

    const credentialId = document.getElementById('verifyCredentialId').value;

    try {
        const response = await fetch(`${API_BASE_URL}/verify/${credentialId}`);
        
        const contentType = response.headers.get('content-type');
        let data;
        
        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
        } else {
            const text = await response.text();
            throw new Error(`Expected JSON but got: ${contentType}. Response: ${text.substring(0, 100)}`);
        }
        
        if (!response.ok) {
            // If response is not ok, use the parsed JSON error message
            throw new Error(data.message || `Server error: ${response.status}`);
        }

        if (data.success) {
            if (data.verified) {
                resultDiv.className = 'result-message success';
                resultDiv.innerHTML = '<strong>✓ Credential Verified on Blockchain</strong>';

                // Display credential details
                const verifyCard = document.createElement('div');
                verifyCard.className = 'verify-result-card';
                verifyCard.innerHTML = `
                    <h3>Credential Details</h3>
                    <div class="field"><strong>Student Name:</strong> ${data.credential.studentName}</div>
                    <div class="field"><strong>Institution:</strong> ${data.credential.institutionName}</div>
                    <div class="field"><strong>Degree:</strong> ${data.credential.degree}</div>
                    <div class="field"><strong>Field of Study:</strong> ${data.credential.fieldOfStudy}</div>
                    <div class="field"><strong>Graduation Date:</strong> ${data.credential.graduationDate}</div>
                    <div class="field"><strong>Transaction Hash:</strong> <code>${data.credential.blockchainTxHash}</code></div>
                    <div class="status verified">Verified on Blockchain</div>
                `;
                resultDiv.appendChild(verifyCard);

                // Load QR code
                try {
                    const qrResponse = await fetch(`${API_BASE_URL}/credentials/${credentialId}/qrcode`);
                    if (qrResponse.ok) {
                        const contentType = qrResponse.headers.get('content-type');
                        if (contentType && contentType.includes('application/json')) {
                            const qrData = await qrResponse.json();
                            if (qrData.success && qrData.qrCode) {
                                qrCodeDiv.innerHTML = `
                                    <h3>Verification QR Code</h3>
                                    <img src="${qrData.qrCode}" alt="QR Code">
                                    <p><small>Scan to verify this credential</small></p>
                                `;
                            }
                        }
                    }
                } catch (qrError) {
                    console.warn('QR code generation failed:', qrError);
                }
            } else {
                resultDiv.className = 'result-message info';
                resultDiv.innerHTML = `
                    <strong>Credential Found (Pending Blockchain Storage)</strong><br>
                    ${data.credential.message}<br>
                    <div class="verify-result-card" style="margin-top: 15px;">
                        <div class="field"><strong>Student Name:</strong> ${data.credential.studentName}</div>
                        <div class="field"><strong>Institution:</strong> ${data.credential.institutionName}</div>
                        <div class="field"><strong>Degree:</strong> ${data.credential.degree}</div>
                        <div class="field"><strong>Field of Study:</strong> ${data.credential.fieldOfStudy}</div>
                        <div class="field"><strong>Graduation Date:</strong> ${data.credential.graduationDate}</div>
                        <div class="status pending">Pending Blockchain Storage</div>
                    </div>
                `;

                // Load QR code for pending credential
                try {
                    const qrResponse = await fetch(`${API_BASE_URL}/credentials/${credentialId}/qrcode`);
                    if (qrResponse.ok) {
                        const contentType = qrResponse.headers.get('content-type');
                        if (contentType && contentType.includes('application/json')) {
                            const qrData = await qrResponse.json();
                            if (qrData.success && qrData.qrCode) {
                                qrCodeDiv.innerHTML = `
                                    <h3>Verification QR Code</h3>
                                    <img src="${qrData.qrCode}" alt="QR Code">
                                    <p><small>QR code for future verification (will be updated once on blockchain)</small></p>
                                `;
                            }
                        }
                    }
                } catch (qrError) {
                    console.warn('QR code generation failed:', qrError);
                }
            }
        } else {
            resultDiv.className = 'result-message error';
            resultDiv.textContent = data.message || 'Credential not found';
        }
    } catch (error) {
        resultDiv.className = 'result-message error';
        resultDiv.textContent = 'Error: ' + error.message;
    }
});

// Load all credentials
async function loadCredentials() {
    const credentialsList = document.getElementById('credentials-list');
    credentialsList.innerHTML = '<div class="loading">Loading credentials...</div>';

    try {
        const response = await fetch(`${API_BASE_URL}/credentials`);
        
        const contentType = response.headers.get('content-type');
        let data;
        
        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
        } else {
            const text = await response.text();
            throw new Error(`Expected JSON but got: ${contentType}. Response: ${text.substring(0, 100)}`);
        }
        
        if (!response.ok) {
            // If response is not ok, use the parsed JSON error message
            throw new Error(data.message || `Server error: ${response.status}`);
        }

        if (data.success && data.credentials.length > 0) {
            credentialsList.innerHTML = data.credentials.map(cred => `
                <div class="credential-card">
                    <h3>${cred.studentName}</h3>
                    <p><strong>Institution:</strong> ${cred.institutionName}</p>
                    <p><strong>Degree:</strong> ${cred.degree}</p>
                    <p><strong>Field of Study:</strong> ${cred.fieldOfStudy}</p>
                    <p><strong>Graduation Date:</strong> ${cred.graduationDate}</p>
                    <p><strong>Credential ID:</strong> <code>${cred.credentialId}</code></p>
                    <p><strong>Created:</strong> ${new Date(cred.createdAt).toLocaleString()}</p>
                    ${cred.onBlockchain ? 
                        `<span class="status verified">✓ Verified on Blockchain</span>` : 
                        `<span class="status pending">⏳ Pending (12-hour wait)</span>`
                    }
                    ${cred.blockchainTxHash ? `<p><strong>Tx Hash:</strong> <code>${cred.blockchainTxHash}</code></p>` : ''}
                    <div style="margin-top: 15px;">
                        ${!cred.onBlockchain ? 
                            `<button onclick="editCredential('${cred.credentialId}')" class="btn btn-secondary" style="padding: 8px 15px; font-size: 0.9em;">Edit</button>` : 
                            `<button disabled class="btn btn-secondary" style="padding: 8px 15px; font-size: 0.9em; opacity: 0.5; cursor: not-allowed;">Cannot Edit (On Blockchain)</button>`
                        }
                    </div>
                </div>
            `).join('');
        } else {
            credentialsList.innerHTML = '<p>No credentials found.</p>';
        }
    } catch (error) {
        credentialsList.innerHTML = `<div class="result-message error">Error loading credentials: ${error.message}</div>`;
    }
}

// Load credentials when credentials tab is shown
document.querySelectorAll('.tab-button').forEach(btn => {
    btn.addEventListener('click', (e) => {
        if (e.target && e.target.textContent && e.target.textContent.includes('View Credentials')) {
            setTimeout(loadCredentials, 100);
        }
    });
});

// Edit credential function
async function editCredential(credentialId) {
    try {
        // Fetch credential data
        const response = await fetch(`${API_BASE_URL}/credentials/${credentialId}`);
        
        const contentType = response.headers.get('content-type');
        let data;
        
        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
        } else {
            const text = await response.text();
            alert('Error loading credential: Expected JSON but got: ' + contentType);
            return;
        }
        
        if (!response.ok) {
            alert('Error loading credential: ' + (data.message || `Server error: ${response.status}`));
            return;
        }

        if (!data.success || !data.credential) {
            alert('Error loading credential: ' + (data.message || 'Unknown error'));
            return;
        }

        const cred = data.credential;

        // Check if credential is on blockchain
        if (cred.onBlockchain) {
            alert('Cannot edit credential that is already stored on blockchain.');
            return;
        }

        // Populate edit form
        document.getElementById('editCredentialId').value = cred.credentialId;
        document.getElementById('editStudentName').value = cred.studentName;
        document.getElementById('editInstitutionName').value = cred.institutionName;
        document.getElementById('editDegree').value = cred.degree;
        document.getElementById('editFieldOfStudy').value = cred.fieldOfStudy;
        document.getElementById('editGraduationDate').value = cred.graduationDate;

        // Show edit tab
        const editButton = document.getElementById('edit-tab-button');
        editButton.style.display = 'block';
        showTab('edit', editButton);
    } catch (error) {
        alert('Error loading credential: ' + error.message);
    }
}

// Edit credential form submission
document.getElementById('edit-credential-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const resultDiv = document.getElementById('edit-result');
    resultDiv.className = 'result-message';
    resultDiv.textContent = 'Updating...';

    const credentialId = document.getElementById('editCredentialId').value;
    const formData = {
        studentName: document.getElementById('editStudentName').value,
        institutionName: document.getElementById('editInstitutionName').value,
        degree: document.getElementById('editDegree').value,
        fieldOfStudy: document.getElementById('editFieldOfStudy').value,
        graduationDate: document.getElementById('editGraduationDate').value
    };

    try {
        const response = await fetch(`${API_BASE_URL}/credentials/${credentialId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const contentType = response.headers.get('content-type');
        let data;
        
        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
        } else {
            const text = await response.text();
            throw new Error(`Expected JSON but got: ${contentType}. Response: ${text.substring(0, 100)}`);
        }
        
        if (!response.ok) {
            // If response is not ok, use the parsed JSON error message
            throw new Error(data.message || `Server error: ${response.status}`);
        }

        if (data.success) {
            resultDiv.className = 'result-message success';
            resultDiv.innerHTML = `
                <strong>Success!</strong><br>
                Credential updated successfully.<br>
                <button onclick="const btn = Array.from(document.querySelectorAll('.tab-button')).find(b => b.textContent.includes('View Credentials')); showTab('credentials', btn); loadCredentials();" class="btn btn-secondary" style="margin-top: 10px;">View All Credentials</button>
            `;
        } else {
            resultDiv.className = 'result-message error';
            resultDiv.textContent = data.message || 'Error updating credential';
        }
    } catch (error) {
        resultDiv.className = 'result-message error';
        resultDiv.textContent = 'Error: ' + error.message;
    }
});

