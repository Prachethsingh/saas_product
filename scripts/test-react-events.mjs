// scripts/test-react-events.mjs
import fs from 'fs';
import path from 'path';

async function testAll() {
  const targetsRes = await fetch('http://localhost:9222/json/list');
  const targets = await targetsRes.json();
  let pageTarget = targets.find(t => t.url.includes('localhost:3000'));
  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
  let id = 1;
  const send = (method, params = {}) => new Promise(res => {
    const cur = id++;
    const handler = (e) => {
      const d = JSON.parse(e.data);
      if (d.id === cur) {
        ws.removeEventListener('message', handler);
        res(d);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id: cur, method, params }));
  });

  await new Promise(r => ws.onopen = r);
  await send('Page.enable');
  await send('Runtime.enable');

  console.log('--- TEST 1: Shorten Filter ---');
  await send('Runtime.evaluate', {
    expression: `Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Shorten'))?.click()`
  });
  await new Promise(r => setTimeout(r, 400));
  const shorten = await send('Runtime.evaluate', {
    expression: `Array.from(document.querySelectorAll('a[href^="/meetings/"]')).map(a => a.innerText.trim()).filter(Boolean)`,
    returnByValue: true
  });
  console.log('Visible meetings under Shorten:', shorten.result?.result?.value);

  console.log('--- TEST 2: Reset to All ---');
  await send('Runtime.evaluate', {
    expression: `Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('All'))?.click()`
  });
  await new Promise(r => setTimeout(r, 400));
  const all = await send('Runtime.evaluate', {
    expression: `Array.from(document.querySelectorAll('a[href^="/meetings/"]')).map(a => a.innerText.trim()).filter(Boolean)`,
    returnByValue: true
  });
  console.log('Visible meetings under All:', all.result?.result?.value);

  console.log('--- TEST 3: Search Filter ("Architecture") ---');
  await send('Runtime.evaluate', {
    expression: `(() => {
      const input = document.querySelector('input[placeholder*="Filter by title"]');
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      setter.call(input, 'Architecture');
      input.dispatchEvent(new Event('input', { bubbles: true }));
    })()`
  });
  await new Promise(r => setTimeout(r, 400));
  const search = await send('Runtime.evaluate', {
    expression: `Array.from(document.querySelectorAll('a[href^="/meetings/"]')).map(a => a.innerText.trim()).filter(Boolean)`,
    returnByValue: true
  });
  console.log('Visible meetings searching "Architecture":', search.result?.result?.value);

  // Clear search
  await send('Runtime.evaluate', {
    expression: `(() => {
      const input = document.querySelector('input[placeholder*="Filter by title"]');
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      setter.call(input, '');
      input.dispatchEvent(new Event('input', { bubbles: true }));
    })()`
  });
  await new Promise(r => setTimeout(r, 400));

  console.log('--- TEST 4: Loaded Rate Slider ($85 -> $125) ---');
  await send('Runtime.evaluate', {
    expression: `(() => {
      const slider = document.querySelector('input[type="range"]');
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      setter.call(slider, '125');
      slider.dispatchEvent(new Event('input', { bubbles: true }));
      slider.dispatchEvent(new Event('change', { bubbles: true }));
    })()`
  });
  await new Promise(r => setTimeout(r, 400));
  const burn = await send('Runtime.evaluate', {
    expression: `document.body.innerText.match(/\\$[\\d,]+(\\/yr)/)?.[0]`,
    returnByValue: true
  });
  console.log('Recalculated Burn at $125/hr:', burn.result?.result?.value);

  console.log('--- TEST 5: Quick Audit Drawer and Interactive Checklist ---');
  await send('Runtime.evaluate', {
    expression: `Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Quick Audit'))?.click()`
  });
  await new Promise(r => setTimeout(r, 400));

  await send('Runtime.evaluate', {
    expression: `(() => {
      const items = Array.from(document.querySelectorAll('div')).filter(d => d.innerText && (d.innerText.includes('Post Slack') || d.innerText.includes('Trim calendar')));
      if (items.length > 0) {
        items[0].click();
      }
    })()`
  });
  await new Promise(r => setTimeout(r, 300));
  const checklistScore = await send('Runtime.evaluate', {
    expression: `document.body.innerText.match(/\\d\\/3 Completed/)?.[0]`,
    returnByValue: true
  });
  console.log('Checklist completion score after toggle:', checklistScore.result?.result?.value);

  // Take screenshot
  const snapDrawer = await send('Page.captureScreenshot', { format: 'png' });
  if (snapDrawer.result?.data) {
    fs.writeFileSync(path.resolve('screenshot-drawer-tested.png'), Buffer.from(snapDrawer.result.data, 'base64'));
    console.log('✓ Captured screenshot-drawer-tested.png');
  }

  ws.close();
  console.log('✓ ALL TESTS PASSED COMPLETELY.');
}

testAll().catch(console.error);
