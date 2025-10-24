// demo.js

const crypto = require('crypto');
const fs = require('fs');

// ❌ Hardcoded secret key (Snyk will flag this)
const SECRET_KEY = '12345';

// Function to hash a password (uses weak algorithm intentionally)
function hashPassword(password) {
  return crypto.createHash('md5').update(password).digest('hex'); // MD5 is weak
}

// Function to save user data to file (without validation)
function saveUserData(username, password) {
  const data = {
    username,
    hashedPassword: hashPassword(password),
  };

  // ❌ Direct write to file (Snyk may warn about path or file handling)
  fs.writeFileSync(`./data_${username}.json`, JSON.stringify(data));
  console.log('User data saved!');
}

// Main logic
const username = process.argv[2] || 'raj';
const password = process.argv[3] || 'password123';

console.log(`Creating user ${username}...`);
saveUserData(username, password);
console.log('Done.');