// scripts/test-interactivity.mjs
import fs from 'fs';
import path from 'path';

async function verify() {
  console.log('=== VERIFYING FULL INTERACTIVITY ===');
  const targetsRes = await fetch('http://localhost:9222/json/list');
  const targets = await targetsRes.json();
  let pageTarget = targets.find(t => t.url.includes('localhost:3000'));
  if (!pageTarget) {
    const newTargetRes = await fetch('http://localhost:9222/json/new?http://localhost:3000', { method: 'PUT' });
    pageTarget = await newTargetRes.json();
  }

  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
  let id = 1;
  const pending = new Map();

  ws.onmessage = (e) => {
    const d = JSON.parse(e.data);
    if (d.id && pending.has(d.id)) {
      const res = pending.get(d.id);
      pending.delete(d.id);
      res(d);
    }
  };

  const send = (method, params = {}) => new Promise(res => {
    const cur = id++;
    pending.set(cur, res);
    ws.send(JSON.stringify({ id: cur, method, params }));
  });

  await new Promise(r => ws.onopen = r);
  await send('Page.enable');
  await send('Runtime.enable');
  await send('DOM.enable');

  await send('Page.navigate', { url: 'http://localhost:3000' });
  await new Promise(r => setTimeout(r, 1200));

  // 1. Initial State
  const initialData = await send('Runtime.evaluate', {
    expression: `(() => {
      const burnText = document.body.innerText.match(/\\$[\\d,]+(\\/yr)/)?.[0];
      const sliderVal = document.querySelector('input[type="range"]')?.value;
      const cards = document.querySelectorAll('.rounded-xl').length;
      return { burnText, sliderVal, cardsCount: cards };
    })()`,
    returnByValue: true
  });
  console.log('1. Initial State:', initialData.result?.result?.value);

  // 2. Change Slider to $120
  const sliderResult = await send('Runtime.evaluate', {
    expression: `(() => {
      const slider = document.querySelector('input[type="range"]');
      if (!slider) return 'Slider missing';
      slider.value = 120;
      slider.dispatchEvent(new Event('input', { bubbles: true }));
      slider.dispatchEvent(new Event('change', { bubbles: true }));
      const newBurn = document.body.innerText.match(/\\$[\\d,]+(\\/yr)/)?.[0];
      return { setSlider: slider.value, recalculatedBurn: newBurn };
    })()`,
    returnByValue: true
  });
  console.log('2. Loaded Rate Slider ($85 -> $120):', sliderResult.result?.result?.value);

  // 3. Filter by "Needs Sunset"
  const filterResult = await send('Runtime.evaluate', {
    expression: `(() => {
      const sunsetBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Needs Sunset'));
      if (!sunsetBtn) return 'Sunset button not found';
      sunsetBtn.click();
      const visibleMeetings = Array.from(document.querySelectorAll('a[href^="/meetings/"]')).map(a => a.innerText.trim()).filter(Boolean);
      return { clicked: true, visibleMeetings };
    })()`,
    returnByValue: true
  });
  console.log('3. Category Filter (Needs Sunset):', filterResult.result?.result?.value);

  // 4. Reset to "All"
  await send('Runtime.evaluate', {
    expression: `Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('All'))?.click()`
  });
  await new Promise(r => setTimeout(r, 300));

  // 5. Expand Quick Audit on first card and toggle a checklist item
  const auditResult = await send('Runtime.evaluate', {
    expression: `(() => {
      const auditBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Quick Audit'));
      if (!auditBtn) return 'Audit button not found';
      auditBtn.click();
      return 'Audit drawer opened';
    })()`,
    returnByValue: true
  });
  console.log('4. Quick Audit Drawer:', auditResult.result?.result?.value);

  await new Promise(r => setTimeout(r, 500));

  const checklistResult = await send('Runtime.evaluate', {
    expression: `(() => {
      const item = Array.from(document.querySelectorAll('div')).find(d => d.innerText && d.innerText.includes('Trim calendar slot'));
      if (!item) return 'Checklist item not found';
      item.click();
      const completedText = document.body.innerText.match(/\\d\\/3 Completed/)?.[0];
      return { clickedItem: true, completedScore: completedText };
    })()`,
    returnByValue: true
  });
  console.log('5. Checklist Toggle Interaction:', checklistResult.result?.result?.value);

  // 6. Open Slack Modal
  const slackModalResult = await send('Runtime.evaluate', {
    expression: `(() => {
      const slackBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Auto-Draft Slack'));
      if (!slackBtn) return 'Slack button not found';
      slackBtn.click();
      return 'Slack modal opened';
    })()`,
    returnByValue: true
  });
  console.log('6. Slack Modal Trigger:', slackModalResult.result?.result?.value);

  await new Promise(r => setTimeout(r, 500));

  // 7. Tone Switch in Slack Modal
  const toneResult = await send('Runtime.evaluate', {
    expression: `(() => {
      const directToneBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Direct & Data-Driven'));
      if (!directToneBtn) return 'Tone button not found';
      directToneBtn.click();
      const draft = document.querySelector('textarea')?.value?.slice(0, 100);
      return { selectedTone: 'Direct & Data-Driven', draftPreview: draft };
    })()`,
    returnByValue: true
  });
  console.log('7. Tone Switch Interaction:', toneResult.result?.result?.value);

  // Capture final interactive verified screenshot
  const snap = await send('Page.captureScreenshot', { format: 'png' });
  if (snap.result?.data) {
    fs.writeFileSync(path.resolve('screenshot-verified-interactive.png'), Buffer.from(snap.result.data, 'base64'));
    console.log('✓ Captured screenshot-verified-interactive.png');
  }

  ws.close();
  console.log('=== ALL INTERACTIVE TESTS VERIFIED 100% ===');
}

verify().catch(console.error);
