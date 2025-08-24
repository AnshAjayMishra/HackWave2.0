// Test environment variables
const fs = require('fs');
const path = require('path');

try {
  const envContent = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf8');
  console.log('.env.local content:');
  console.log(envContent);
} catch (error) {
  console.log('Error reading .env.local:', error.message);
}
