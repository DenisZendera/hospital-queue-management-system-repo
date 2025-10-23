import os from 'os';
import qrcode from 'qrcode';

// Get local IP address automatically
function getLocalIPAddress() {
  const interfaces = os.networkInterfaces();

  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // Skip internal (localhost) and non-IPv4 addresses
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }

  return 'localhost';
}

const ipAddress = getLocalIPAddress();
const patientDashboardUrl = `http://${ipAddress}:8080`;

console.log('\n╔══════════════════════════════════════════════════════════╗');
console.log('║                                                          ║');
console.log('║   📱 PATIENT DASHBOARD - MOBILE ACCESS                  ║');
console.log('║                                                          ║');
console.log('╚══════════════════════════════════════════════════════════╝\n');

console.log(`🌐 Your Computer's IP Address: ${ipAddress}\n`);

console.log('📋 Patient Dashboard URL:');
console.log(`   ${patientDashboardUrl}\n`);

// Generate QR code
console.log('📱 QR CODE (Scan with phone camera):\n');

// Patient Dashboard QR Code
qrcode.toString(patientDashboardUrl, { type: 'terminal', small: true }, (err, qr) => {
  if (err) {
    console.error('Error generating QR code:', err);
    return;
  }

  console.log(qr);
  console.log('\n');

  console.log('✅ Instructions:');
  console.log('   1. Make sure your phone is on the same WiFi network');
  console.log('   2. Scan the QR code with your phone camera');
  console.log('   3. Tap the notification to open the patient dashboard\n');

  console.log('💡 Pro Tips:');
  console.log('   • Take a screenshot for easy sharing during demo');
  console.log('   • Admin dashboard stays on your laptop (localhost:5173)\n');
});
