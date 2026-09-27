// scripts/debug-client.mjs
async function testHydration() {
  const targetsRes = await fetch('http://localhost:9222/json/list');
  const targets = await targetsRes.json();
  let pageTarget = targets.find(t => t.url.includes('localhost:3000'));
  if (!pageTarget) return console.log('No page target');

  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
  let id = 1;
  const send = (method, params = {}) => new Promise(res => {
    const cur = id++;
    const handler = (e) => {
      const data = JSON.parse(e.data);
      if (data.id === cur) {
        ws.removeEventListener('message', handler);
        res(data);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id: cur, method, params }));
  });

  await new Promise(r => ws.onopen = r);

  ws.onmessage = (e) => {
    const d = JSON.parse(e.data);
    if (d.method === 'Runtime.consoleAPICalled') {
      console.log('Console:', d.params.type, d.params.args.map(a => a.value || a.description));
    }
    if (d.method === 'Log.entryAdded') {
      console.log('Log entry:', d.params.entry?.text, d.params.entry?.url);
    }
    if (d.method === 'Runtime.exceptionThrown') {
      console.log('EXCEPTION:', JSON.stringify(d.params.exceptionDetails));
    }
  };

  await send('Log.enable');
  await send('Runtime.enable');
  await send('Page.enable');
  await send('Page.navigate', { url: 'http://localhost:3000' });
  await new Promise(r => setTimeout(r, 2000));

  const evalResult = await send('Runtime.evaluate', {
    expression: `(() => {
      return {
        scriptsCount: document.querySelectorAll('script').length,
        buttonsCount: document.querySelectorAll('button').length,
        buttons: Array.from(document.querySelectorAll('button')).map(b => b.innerText.trim()).filter(Boolean),
        sliderVal: document.querySelector('input[type="range"]')?.value,
        hasFilterButtons: Array.from(document.querySelectorAll('button')).some(b => b.innerText.includes('All'))
      };
    })()`,
    returnByValue: true
  });
  console.log('DOM status:', evalResult.result?.result?.value);

  // Now let's test clicking a button and checking what happens
  const clickTest = await send('Runtime.evaluate', {
    expression: `(() => {
      const allButtons = Array.from(document.querySelectorAll('button'));
      const shortenFilter = allButtons.find(b => b.innerText.includes('Shorten'));
      if (shortenFilter) {
        shortenFilter.click();
        return 'Clicked Shorten filter';
      }
      return 'Shorten filter button not found';
    })()`,
    returnByValue: true
  });
  console.log('Click test:', clickTest.result?.result?.value);

  await new Promise(r => setTimeout(r, 1000));

  const afterClick = await send('Runtime.evaluate', {
    expression: `(() => {
      return {
        meetingCardsCount: document.querySelectorAll('[data-meeting-card]').length || document.querySelectorAll('.rounded-2xl').length,
        bodyTextSnippet: document.body.innerText.slice(0, 300)
      };
    })()`,
    returnByValue: true
  });
  console.log('After click:', afterClick.result?.result?.value);

  ws.close();
}

testHydration().catch(console.error);
