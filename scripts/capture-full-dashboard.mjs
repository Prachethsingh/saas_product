import fs from 'fs';
import path from 'path';

async function run() {
  const targetsRes = await fetch('http://localhost:9222/json/list');
  const targets = await targetsRes.json();
  let pageTarget = targets.find(t => t.url.includes('localhost:3000'));
  if (!pageTarget) {
    const newTargetRes = await fetch('http://localhost:9222/json/new?http://localhost:3000', { method: 'PUT' });
    pageTarget = await newTargetRes.json();
  }

  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
  let messageId = 1;
  const pending = new Map();

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.id && pending.has(data.id)) {
      const resolver = pending.get(data.id);
      pending.delete(data.id);
      resolver(data);
    }
  };

  const send = (method, params = {}) => {
    return new Promise((resolve) => {
      const id = messageId++;
      pending.set(id, resolve);
      ws.send(JSON.stringify({ id, method, params }));
    });
  };

  await new Promise(r => ws.onopen = r);
  await send('Page.enable');
  await send('Runtime.enable');
  await send('Page.navigate', { url: 'http://localhost:3000' });
  await new Promise(r => setTimeout(r, 1200));

  // Scroll down to meetings list
  await send('Runtime.evaluate', {
    expression: `window.scrollTo({ top: 450, behavior: 'instant' })`
  });
  await new Promise(r => setTimeout(r, 600));

  // Expand the first meeting quick audit
  await send('Runtime.evaluate', {
    expression: `(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Quick Audit'));
      if (btn) btn.click();
    })()`
  });
  await new Promise(r => setTimeout(r, 600));

  const snap = await send('Page.captureScreenshot', { format: 'png' });
  if (snap.result?.data) {
    fs.writeFileSync(path.resolve('screenshot-meetings-list.png'), Buffer.from(snap.result.data, 'base64'));
    console.log('✓ Saved screenshot-meetings-list.png');
  }

  // Scroll to simulator
  await send('Runtime.evaluate', {
    expression: `window.scrollTo({ top: 1200, behavior: 'instant' })`
  });
  await new Promise(r => setTimeout(r, 600));

  const snapSim = await send('Page.captureScreenshot', { format: 'png' });
  if (snapSim.result?.data) {
    fs.writeFileSync(path.resolve('screenshot-simulator.png'), Buffer.from(snapSim.result.data, 'base64'));
    console.log('✓ Saved screenshot-simulator.png');
  }

  ws.close();
}

run().catch(console.error);
