import EventEmitter from 'eventemitter3';

class WebSocket extends EventEmitter {
  constructor() {
    super();
    this.ws = null;
    this.onMessage = this.onMessage.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onOpen = this.onOpen.bind(this);
    this.onError = this.onError.bind(this);
  }

  getWsUri() {
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

  connect() {
    const uri = this.getWsUri();
    this.ws = new window.WebSocket(uri);
    this.ws.onopen = this.onOpen;
    this.ws.onclose = this.onClose;
    this.ws.onerror = this.onError;
    this.ws.onmessage = this.onMessage;
  }

  send(data) {
    this.ws.send(data);
  }

  sendJson(data) {
    this.ws.send(JSON.stringify(data));
  }

  onOpen() {
    this.sendJson({
      type: 'C2S_OPEN',
    });
    console.log('socket onopen');
  }

  onClose(evt) {
    console.log('socket onclose: ', evt);
  }

  onError(err) {
    console.log('socket onerror: ', err);
  }

  onMessage(evt) {
    const msg = JSON.parse(evt.data);
    this.emit('message', msg);
  }
}

let webSocket = null;

function getWebSocket() {
  if (!webSocket) {
    webSocket = new WebSocket();
  }
  return webSocket;
}

function connectWS() {
  const webSocket = getWebSocket();
  webSocket.connect();
}

function sendWS(data) {
  const webSocket = getWebSocket();
  webSocket.send(data);
}

function sendWSJson(data) {
  sendWS(JSON.stringify(data));
}

export {
  getWebSocket,
  connectWS,
  sendWS,
  sendWSJson,
};
