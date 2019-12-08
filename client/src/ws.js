let ws = null;
const messageHandlers = new Map();

function getWsUri() {
  const loc = window.location;
  let wsUri = '';
  if (loc.protocol === 'https:') {
    wsUri += 'wss://';
  } else {
    wsUri += 'ws://';
  }
  wsUri += loc.host;
  wsUri += '/ws';
  return wsUri;
}

function registerMessageHandler(type, handler) {
  const handlers = messageHandlers.get(type) || [];
  handlers.push(handler);
  messageHandlers.set(type, handlers);
}

function removeMessageHandler(type, handler) {
  const handlers = messageHandlers.get(type) || [];
  const newHandlers = handlers.filter(h => h !== handler);
  if (newHandlers.length === 0) {
    messageHandlers.delete(type);
  } else {
    messageHandlers.set(type, newHandlers);
  }
}

function handleMessage(event) {
  if (typeof event.data === 'string') {
    const msg = JSON.parse(event.data);
    const {
      type,
      payload,
    } = msg;
    const handlers = messageHandlers.get(type);
    if (!handlers) {
      return;
    }
    for (var i = 0; i < handlers.length; i++) {
      const handler = handlers[i];
      try {
        handler(payload);
      } catch (err) {
        console.error('websocket message handler error: ', err);
      }
    }
  } else {
    console.log('received not string ws msg');
  }
}

function connect() {
  return new Promise((resolve, reject) => {
    const uri = getWsUri();
    if (ws && ws.readyState === 1) {
      return resolve();
    }
    ws = new window.WebSocket(uri);
    ws.onopen = () => {
      resolve();
    };
    ws.onerror = (err) => {
      console.log('connect web socket error: ', err);
      reject(err);
    };
    ws.onclose = () => {
      console.log('websocket closed');
    };
    ws.onmessage = handleMessage;
  });
}

async function send(data) {
  if (!ws || ws.readyState !== 1) {
    await connect();
  }
  ws.send(data);
}

async function sendJSON(obj) {
  await send(JSON.stringify(obj));
}

export default {
  sendJSON,
  registerMessageHandler,
  removeMessageHandler,
};
