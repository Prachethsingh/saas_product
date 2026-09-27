// scripts/check-network.mjs
async function checkNetwork() {
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

  const responses = [];
  ws.onmessage = (e) => {
    const d = JSON.parse(e.data);
    if (d.method === 'Network.responseReceived') {
      responses.push({
        url: d.params.response.url,
        status: d.params.response.status,
        mimeType: d.params.response.mimeType
      });
    }
  };

  await send('Network.enable');
  await send('Page.enable');
  await send('Page.reload', { ignoreCache: true });
  await new Promise(r => setTimeout(r, 2500));

  console.log('--- Network responses count:', responses.length);
  for (const res of responses) {
    if (res.status >= 400 || res.url.includes('_next/static')) {
      console.log(`[${res.status}] ${res.url}`);
    }
  }

  ws.close();
}

checkNetwork().catch(console.error);
