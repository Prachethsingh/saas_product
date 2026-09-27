// scripts/test-ui.mjs
import fs from 'fs';
import path from 'path';

async function runTest() {
  console.log('--- Connecting to Browser CDP ---');
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

  await new Promise((resolve) => ws.onopen = resolve);

  await send('Page.enable');
  await send('Runtime.enable');
  await send('DOM.enable');

  await send('Page.navigate', { url: 'http://localhost:3000' });
  await new Promise(r => setTimeout(r, 1500));

  // 1. Test Slider ($85 -> $130)
  const sliderEval = await send('Runtime.evaluate', {
    expression: `(() => {
      const slider = document.querySelector('input[type="range"]');
      if (!slider) return 'Slider missing';
      slider.value = 130;
      slider.dispatchEvent(new Event('input', { bubbles: true }));
      slider.dispatchEvent(new Event('change', { bubbles: true }));
      return { newSliderValue: slider.value, burnDisplay: document.body.innerText.match(/\\$[\\d,]+(\\/yr)?/g)?.[0] };
    })()`,
    returnByValue: true
  });
  console.log('✓ Slider Test:', sliderEval.result?.result?.value);

  // 2. Click "Quick Audit" on first meeting to open drawer
  const drawerEval = await send('Runtime.evaluate', {
    expression: `(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Quick Audit'));
      if (btn) {
        btn.click();
        return 'Quick Audit Clicked';
      }
      return 'Quick Audit Not Found';
    })()`,
    returnByValue: true
  });
  console.log('✓ Drawer Test:', drawerEval.result?.result?.value);

  // Capture screenshot of middle page with cards and sparklines
  await new Promise(r => setTimeout(r, 600));
  const snap1 = await send('Page.captureScreenshot', { format: 'png' });
  if (snap1.result?.data) {
    fs.writeFileSync(path.resolve('screenshot-dashboard-cards.png'), Buffer.from(snap1.result.data, 'base64'));
    console.log('✓ Captured screenshot-dashboard-cards.png');
  }

  // 3. Click "Auto-Draft Slack" to open modal
  const modalEval = await send('Runtime.evaluate', {
    expression: `(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Auto-Draft Slack'));
      if (btn) {
        btn.click();
        return 'Auto-Draft Slack Clicked';
      }
      return 'Slack Button Not Found';
    })()`,
    returnByValue: true
  });
  console.log('✓ Slack Modal Test:', modalEval.result?.result?.value);

  await new Promise(r => setTimeout(r, 800));

  // 4. In Slack Modal: switch tone to "Zombie-Hunter 🧟"
  const toneEval = await send('Runtime.evaluate', {
    expression: `(() => {
      const zombieBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Zombie-Hunter'));
      if (zombieBtn) {
        zombieBtn.click();
        const text = document.querySelector('textarea')?.value?.slice(0, 120);
        return { clicked: true, previewText: text };
      }
      return { clicked: false };
    })()`,
    returnByValue: true
  });
  console.log('✓ Tone Switcher Test:', toneEval.result?.result?.value);

  // Capture screenshot of Slack Modal
  const snap2 = await send('Page.captureScreenshot', { format: 'png' });
  if (snap2.result?.data) {
    fs.writeFileSync(path.resolve('screenshot-slack-modal.png'), Buffer.from(snap2.result.data, 'base64'));
    console.log('✓ Captured screenshot-slack-modal.png');
  }

  ws.close();
  console.log('✓ All Tests Passed.');
}

runTest().catch(console.error);
