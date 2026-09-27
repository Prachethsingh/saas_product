import fs from 'fs';
import path from 'path';
import os from 'os';

const homedir = os.homedir();
const configPath = path.join(homedir, '.antideploy', 'config.json');

if (!fs.existsSync(configPath)) {
  console.error('No Antideploy config found');
  process.exit(1);
}

const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const token = config.token;
const applicationId = 'cee70017-5498-4fd1-9ad7-fd238e45f509';

async function main() {
  const res = await fetch(`https://antideploy.com/api/v1/database?applicationId=${applicationId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  console.log('Status:', res.status);
  const data = await res.json();
  console.log('Response:', JSON.stringify(data, null, 2));
}

main().catch(console.error);
