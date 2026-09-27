#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import os from 'os';
import https from 'https';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

// 1. Read config and applicationId
const configPath = path.join(os.homedir(), '.antideploy', 'config.json');
if (!fs.existsSync(configPath)) {
  console.error('Error: Antideploy config not found at ~/.antideploy/config.json. Run authorization first.');
  process.exit(1);
}

let token;
try {
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  token = config.token || config.accessToken;
} catch (e) {
  console.error('Error reading ~/.antideploy/config.json:', e.message);
  process.exit(1);
}

if (!token) {
  console.error('Error: No token found in ~/.antideploy/config.json.');
  process.exit(1);
}

const antideployJsonPath = path.join(rootDir, '.antideploy.json');
if (!fs.existsSync(antideployJsonPath)) {
  console.error('Error: .antideploy.json not found in project root.');
  process.exit(1);
}

let applicationId;
try {
  const appConfig = JSON.parse(fs.readFileSync(antideployJsonPath, 'utf8'));
  applicationId = appConfig.applicationId;
} catch (e) {
  console.error('Error reading .antideploy.json:', e.message);
  process.exit(1);
}

if (!applicationId) {
  console.error('Error: applicationId missing from .antideploy.json.');
  process.exit(1);
}

console.log(`Deploying application: ${applicationId}...`);

// 2. Create tarball
const tempTarPath = path.join(os.tmpdir(), `antideploy-${Date.now()}.tar.gz`);
try {
  console.log('Packaging project files (excluding node_modules, .git, .next)...');
  execSync(`tar -czf "${tempTarPath}" --exclude=.git --exclude=node_modules --exclude=.next .`, {
    cwd: rootDir,
    stdio: 'inherit'
  });
} catch (e) {
  console.error('Failed to create project tarball:', e.message);
  process.exit(1);
}

const archiveData = fs.readFileSync(tempTarPath);
const archiveSizeKB = (archiveData.length / 1024).toFixed(1);
console.log(`Archive created: ${archiveSizeKB} KB`);

// 3. Upload to Antideploy
const boundary = `----AntideployBoundary${Date.now()}`;
const crlf = '\r\n';

const headerParts = [
  `--${boundary}`,
  'Content-Disposition: form-data; name="archive"; filename="project.tar.gz"',
  'Content-Type: application/gzip',
  '',
  ''
].join(crlf);

const footerParts = `${crlf}--${boundary}--${crlf}`;

const preBuffer = Buffer.from(headerParts, 'utf8');
const postBuffer = Buffer.from(footerParts, 'utf8');
const totalLength = preBuffer.length + archiveData.length + postBuffer.length;

console.log('Pushing archive to Antideploy API...');

const isForce = process.argv.includes('--force');
const deployUrl = `https://antideploy.com/api/v1/deploy?applicationId=${applicationId}${isForce ? '&force=true' : ''}`;

const req = https.request(deployUrl, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': `multipart/form-data; boundary=${boundary}`,
    'Content-Length': totalLength
  }
}, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    try {
      fs.unlinkSync(tempTarPath);
    } catch (_) {}

    if (res.statusCode === 200) {
      console.log('Deploy status: unchanged (identical content hash to last push).');
      process.exit(0);
    }

    if (res.statusCode !== 202) {
      console.error(`Deploy request rejected (Status ${res.statusCode}):`, body);
      process.exit(1);
    }

    let parsed;
    try {
      parsed = JSON.parse(body);
    } catch (e) {
      console.error('Failed to parse deploy response:', body);
      process.exit(1);
    }

    const { taskId, watch } = parsed;
    console.log(`\nDeploy queued successfully!`);
    console.log(`Task ID: ${taskId}`);
    if (watch) console.log(`Watch URL: ${watch}`);
    console.log('\nWatching build and deployment progress...\n');

    pollDeployment(taskId);
  });
});

req.on('error', (err) => {
  try {
    fs.unlinkSync(tempTarPath);
  } catch (_) {}
  console.error('Upload failed:', err.message);
  process.exit(1);
});

req.write(preBuffer);
req.write(archiveData);
req.write(postBuffer);
req.end();

function pollDeployment(taskId) {
  const pollInterval = 3000;

  function check() {
    const pollReq = https.request(`https://antideploy.com/api/v1/deployments/${taskId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        if (res.statusCode !== 200) {
          console.error(`Poll error (status ${res.statusCode}): ${body}`);
          setTimeout(check, pollInterval);
          return;
        }

        let data;
        try {
          data = JSON.parse(body);
        } catch (e) {
          console.error('Failed to parse poll response:', body);
          setTimeout(check, pollInterval);
          return;
        }

        const status = data.status || (data.deployment && data.deployment.status);
        const step = data.currentStep || data.step || (data.deployment && data.deployment.step);
        const url = data.url || (data.deployment && data.deployment.url);

        if (status === 'succeeded' || status === 'live' || status === 'ready') {
          console.log('\n========================================');
          console.log('🎉 Deployment succeeded!');
          if (url) console.log(`🌍 Live URL: ${url}`);
          console.log('========================================\n');
          process.exit(0);
        } else if (status === 'failed') {
          console.error('\n❌ Deployment failed.');
          if (data.error) console.error(`Error: ${data.error}`);
          if (data.failedStep) console.error(`Failed Step: ${data.failedStep}`);
          if (data.deployment && data.deployment.buildLog) {
            console.error('\nBuild Log:\n', data.deployment.buildLog);
          }
          if (data.deployment && data.deployment.runtimeLog) {
            console.error('\nRuntime Log:\n', data.deployment.runtimeLog);
          }
          process.exit(1);
        } else {
          const stepMsg = step ? ` [Step: ${step}]` : '';
          process.stdout.write(`Status: ${status || 'processing'}${stepMsg}...\r`);
          setTimeout(check, pollInterval);
        }
      });
    });

    pollReq.on('error', (e) => {
      console.error('Poll network error:', e.message);
      setTimeout(check, pollInterval);
    });

    pollReq.end();
  }

  check();
}
