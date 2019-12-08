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
    this.onOpen = this.onOpen.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onError = this.onError.bind(this);
  }

  genId() {
    this.currentId += 1;
    return this.currentId + '';
  }

  onConnection(socket, req) {
    console.log('on new connection');
    const id = this.genId();
    this.clients.set(id, socket);
    socket.on('close', (code, reason) => this.onClose(id, code, reason));
    socket.on('message', msg => this.onMessage(id, msg));
  }

  onClose(id) {
    this.clients.delete(id);
  }

  onError(err) {
    console.log('## socket on error: ', err);
  }

  onOpen(socket, id) {
    socket.send(JSON.stringify({
      type: 'S2C_OPEN',
      payload: {
        id,
      },
    }));
  }

  prepareUpload(clientId, socket, payload) {
    const {
      files,
      message,
    } = payload;

    const downloadCode = getRandomString(8);
    this.uploads.set(downloadCode, {
      clientId,
      message,
      files,
    });
    socket.send(JSON.stringify({
      type: 'S2C_PREPARE_UPLOAD',
      payload: {
        downloadCode,
      },
    }));
  }

  prepareDownload(clientId, socket, payload) {
    const {
      downloadCode,
    } = payload;

    const uploadInfo = this.uploads.get(downloadCode);
    if (uploadInfo) {
      socket.send(JSON.stringify({
        type: 'S2C_PREPARE_DOWNLOAD',
        payload: {
          message: uploadInfo.message,
          files: uploadInfo.files,
          clientId: uploadInfo.clientId,
        },
      }));
    } else {
      socket.send(JSON.stringify({
        type: 'S2C_ERROR',
        payload: {
          message: 'downloadCode无效',
        },
      }));
    }
  }

  onMessage(id, _msg) {
    const msg = JSON.parse(_msg);
    const {
      type,
      payload,
    } = msg;

    const socket = this.clients.get(id);

    switch (type) {
      case 'C2S_OPEN': {
        this.onOpen(socket, id);
        break;
      }

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
