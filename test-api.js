/**
 * Simple test script to verify API endpoints
 * Run this after starting the server: node test-api.js
 */

const API_BASE_URL = 'http://localhost:3000/api';

async function testAPI() {
    console.log('🧪 Testing API Endpoints...\n');

    // Test 1: Health Check
    try {
        console.log('1. Testing Health Check...');
        const healthResponse = await fetch(`${API_BASE_URL}/health`);
        const healthData = await healthResponse.json();
        console.log('✓ Health Check:', healthData);
        console.log('');
    } catch (error) {
        console.error('✗ Health Check failed:', error.message);
        return;
    }

    // Test 2: Submit Credential
    try {
        console.log('2. Testing Credential Submission...');
        const submitResponse = await fetch(`${API_BASE_URL}/credentials`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                studentName: 'Test Student',
                institutionName: 'Test University',
                degree: 'Bachelor of Science',
                fieldOfStudy: 'Computer Science',
                graduationDate: '2023-06-15'
            })
        });
        const submitData = await submitResponse.json();
        console.log('✓ Credential Submitted:', submitData);
        
        if (submitData.success && submitData.credential) {
            const credentialId = submitData.credential.credentialId;
            console.log('  Credential ID:', credentialId);
            console.log('');

            // Test 3: Get Credential
            console.log('3. Testing Get Credential...');
            const getResponse = await fetch(`${API_BASE_URL}/credentials/${credentialId}`);
            const getData = await getResponse.json();
            console.log('✓ Credential Retrieved:', getData.success ? 'Success' : 'Failed');
            console.log('');

            // Test 4: Verify Credential
            console.log('4. Testing Verify Credential...');
            const verifyResponse = await fetch(`${API_BASE_URL}/verify/${credentialId}`);
            const verifyData = await verifyResponse.json();
            console.log('✓ Verification Result:', verifyData.verified ? 'Verified' : 'Pending');
            console.log('  Status:', verifyData.credential?.status || 'N/A');
            console.log('');

            // Test 5: Get QR Code
            console.log('5. Testing QR Code Generation...');
            const qrResponse = await fetch(`${API_BASE_URL}/credentials/${credentialId}/qrcode`);
            const qrData = await qrResponse.json();
            console.log('✓ QR Code:', qrData.success ? 'Generated' : 'Failed');
            console.log('');
        }
    } catch (error) {
        console.error('✗ Test failed:', error.message);
    }

    // Test 6: Get All Credentials
    try {
        console.log('6. Testing Get All Credentials...');
        const allResponse = await fetch(`${API_BASE_URL}/credentials`);
        const allData = await allResponse.json();
        console.log(`✓ Found ${allData.credentials?.length || 0} credentials`);
        console.log('');
    } catch (error) {
        console.error('✗ Get All Credentials failed:', error.message);
    }

    console.log('✅ API Tests Complete!');
}

// Run tests
testAPI().catch(console.error);

