// scripts/inspect-hydration.mjs
async function check() {
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

  const errors = [];
  ws.onmessage = (e) => {
    const d = JSON.parse(e.data);
    if (d.method === 'Runtime.consoleAPICalled') {
      console.log('CONSOLE:', d.params.type, d.params.args.map(a => a.value || a.description));
    }
    if (d.method === 'Runtime.exceptionThrown') {
      console.log('EXCEPTION:', d.params.exceptionDetails?.text, d.params.exceptionDetails?.exception?.description);
      errors.push(d.params.exceptionDetails);
    }
  };

  await send('Log.enable');
  await send('Runtime.enable');
  await send('Page.enable');

  await send('Page.reload');
  await new Promise(r => setTimeout(r, 2000));

  // Inspect React fibers on buttons
  const res = await send('Runtime.evaluate', {
    expression: `(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Needs Sunset'));
      if (!btn) return 'Button not found';
      
      const reactPropKeys = Object.keys(btn).filter(k => k.startsWith('__react'));
      const reactProps = reactPropKeys.map(k => ({ key: k, hasOnClick: !!btn[k]?.onClick }));
      
      // Try calling the onClick directly if found
      const propKey = reactPropKeys.find(k => k.startsWith('__reactProps'));
      let directCallResult = 'No reactProps';
      if (propKey && btn[propKey]?.onClick) {
        btn[propKey].onClick({ preventDefault: () => {}, stopPropagation: () => {} });
        directCallResult = 'Called onClick via __reactProps';
      }

      return {
        reactPropKeys,
        reactProps,
        directCallResult
      };
    })()`,
    returnByValue: true
  });
  console.log('Hydration details:', res.result?.result?.value);

  await new Promise(r => setTimeout(r, 500));

  // Check if DOM changed after direct call
  const checkDom = await send('Runtime.evaluate', {
    expression: `Array.from(document.querySelectorAll('a[href^="/meetings/"]')).map(a => a.innerText.trim()).filter(Boolean)`
  });
  console.log('Meetings after direct onClick:', checkDom.result?.result?.value);

  ws.close();
}

check().catch(console.error);
