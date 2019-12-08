import {
  getRandomString,
} from './common/util';

export default class WebSocketServer {
  constructor(wss, req) {
    this._wss = wss;
    this._req = req;
    this.clients = new Map();
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
      type: 's2c_open',
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
      type: 's2c_prepare_upload',
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
        type: 's2c_prepare_download',
        payload: {
          message: uploadInfo.message,
          files: uploadInfo.files,
          clientId: uploadInfo.clientId,
        },
      }));
    } else {
      socket.send(JSON.stringify({
        type: 's2c_error',
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
      case 'c2s_open': {
        this.onOpen(socket, id);
        break;
      }

      case 'c2s_prepare_upload': {
        this.prepareUpload(id, socket, payload);
        break;
      }

      case 'c2s_prepare_download': {
        this.prepareDownload(id, socket, payload);
        break;
      }

      case 'c2s_signal': {
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
          type: 's2c_signal',
          payload: {
            srcId: id,
            ...others,
          },
        }));
      }
    }
  }
}
