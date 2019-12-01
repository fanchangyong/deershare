import EventEmitter from 'eventemitter3';

export default class WebSocket extends EventEmitter {
  constructor() {
    super();
    this.ws = null;
    this.onMessage = this.onMessage.bind(this);
    this.onOpen = this.onOpen.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onError = this.onError.bind(this);
    this.connect();
  }

  getWsUri() {
    const loc = window.location;
    let wsUri = '';
    if (loc.protocol === 'https:') {
      wsUri += 'wss://'
    } else {
      wsUri += 'ws://'
    }
    wsUri += loc.host
    wsUri += '/ws'
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

  sendObject(data) {
    this.ws.send(JSON.stringify(data));
  }

  onOpen() {
    this.send(JSON.stringify({
      type: 'C2S_OPEN'
    }))
  }

  onClose() {
    console.log('socket onclose')
  }

  onError() {
    console.log('socket onerror')
  }

  onMessage(evt) {
    const msg = JSON.parse(evt.data);
    this.emit('message', msg);
  }

}
