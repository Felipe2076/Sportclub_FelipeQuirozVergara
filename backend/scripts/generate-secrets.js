const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const backendDir = path.join(__dirname, '..');
const rootDir = path.join(backendDir, '..');
const envPath = path.join(backendDir, '.env');
const configPath = path.join(rootDir, 'js', 'config.js');

const jwtSecret = crypto.randomBytes(48).toString('hex');
const apiKey = `gsk_${crypto.randomBytes(24).toString('hex')}`;

const envContent = `# Gorila Sport — variables de seguridad (NO subir a GitHub)
PORT=4000
JWT_SECRET=${jwtSecret}
API_KEY=${apiKey}
JWT_EXPIRES_IN=24h
`;

const configContent = `window.GORILA_CONFIG = {
  apiBase: 'http://localhost:4000/api',
  apiKey: '${apiKey}',
};
`;

fs.writeFileSync(envPath, envContent, 'utf-8');
fs.writeFileSync(configPath, configContent, 'utf-8');

console.log('Secretos generados correctamente.');
console.log('');
console.log('Archivos creados:');
console.log(`  - ${envPath}`);
console.log(`  - ${configPath}`);
console.log('');
console.log('API Key (para el frontend):');
console.log(`  ${apiKey}`);
console.log('');
console.log('JWT Secret: solo en el servidor (.env), nunca en el frontend.');
