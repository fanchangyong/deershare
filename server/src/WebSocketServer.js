import {
  MESSAGE_TYPES,
} from './constants';

import {
  getRandomString,
} from './common/util';

export default class WebSocketServer {
  constructor(wss, req) {
    this._wss = wss;
    this._req = req;
    this.clients = new Map();
    // code => file info
    this.uploads = new Map();
    this.currentId = 0;

    this.onMessage = this.onMessage.bind(this);

    this.prepareUpload = this.prepareUpload.bind(this);
  }

  genId() {
    this.currentId += 1;
    return this.currentId;
  }

  onConnection(socket, req) {
    const id = this.genId();
    this.clients.set(id, socket);
    socket.send({
      type: 'S2C_OPEN',
      payload: {
        id,
      },
    });
    socket.on('message', msg => this.onMessage(id, msg));
  }

  prepareUpload(clientId, socket, payload) {
    const {
      uploads,
      message,
    } = payload;

    const code = getRandomString(8);
    this.uploads.set(code, {
      clientId,
      message,
      uploads,
    });
    socket.send({
      code,
    });
  }

  prepareDownload(clientId, socket, payload) {
    const {
      code,
    } = payload;

    const uploadInfo = this.uploads.get(code);
    socket.send({
      ...uploadInfo,
    });
  }

  onMessage(id, _msg) {
    const msg = JSON.parse(_msg);
    const {
      type,
      payload,
    } = msg;

    const socket = this.clients.get(id);

    switch (type) {
      case 'C2S_PREPARE_UPLOAD': {
        this.prepareUpload(id, socket, payload);
        break;
      }

      case 'C2S_PREPARE_DOWNLOAD': {
        this.prepareDownload(id, socket, payload);
        break;
      }

      case 'C2S_SIGNAL': {
        const {
          targetId,
          ...others
        } = payload;

        const targetSocket = this.clients.get(targetId);
        if (!targetSocket) {
          console.log('handling signal, target not found: ', targetId);
          return;
        }
        targetSocket.send(JSON.stringify({
          type: 'S2C_SIGNAL',
          payload: {
            srcId: id,
            ...others,
          },
        }));
      }
    }
  }
}
