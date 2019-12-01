import {
  MESSAGE_TYPES,
} from './constants';

export default class WebSocketServer {
  constructor(wss, req) {
    this._wss = wss;
    this._req = req;
    this.clients = new Map();
    this.currentId = 0;

    this.onMessage = this.onMessage.bind(this);
  }

  genId() {
    this.currentId += 1;
    return this.currentId;
  }

  onConnection(socket, req) {
    const newId = this.genId();
    this.clients.set(newId, socket);
    socket.on('message', msg => this.onMessage(newId, msg));
  }

  onMessage(id, _msg) {
    const msg =JSON.parse(_msg);
    const {
      type,
      payload,
    } = msg;

    const socket = this.clients.get(id);

    switch(type) {
    }
  }
}
