import {
  getRandomString,
} from './common/util';

const clientIdToRecvCodes = new Map();
const recvCodeToFiles = new Map();

if (process.env.NODE_ENV === 'development') {
  recvCodeToFiles.set('123', {
    clientId: '1',
    files: [
      {
        uid: '111',
        name: 'file-111.txt',
        size: 1024,
      },
    ],
  });
}

class Client {
  constructor(id, socket) {
    this.id = id;
    this.peerId = null;
    this.socket = socket;
    this.socket.onerror = (err) => {
      console.error('websocket client onerror: ', err);
    };
  }

  onOpen() {
    this.sendJSON({
      type: 's2c_open',
      payload: {
        id: this.id,
      },
    });
  }

  prepareSend(payload) {
    const {
      files,
      message,
    } = payload;

    const recvCode = getRandomString(6);
    recvCodeToFiles.set(recvCode, {
      clientId: this.id,
      message,
      files,
    });
    clientIdToRecvCodes.set(this.id, recvCode);
    this.sendJSON({
      type: 's2c_prepare_send',
      payload: {
        recvCode,
      },
    });
  }

  deleteRecvCode(payload) {
    const {
      recvCode,
    } = payload;

    recvCodeToFiles.delete(recvCode);
  }

  prepareRecv(payload) {
    const {
      recvCode,
    } = payload;

    const uploadInfo = recvCodeToFiles.get(recvCode);
    if (uploadInfo) {
      this.sendJSON({
        type: 's2c_prepare_recv',
        payload: {
          message: uploadInfo.message,
          files: uploadInfo.files,
          clientId: uploadInfo.clientId,
        },
      });
    } else {
      this.sendJSON({
        type: 's2c_error',
        payload: {
          message: '收件码无效',
        },
      });
    }
  }

  handleMessage(type, payload) {
    switch (type) {
      case 'c2s_open': {
        this.onOpen();
        break;
      }

      case 'c2s_prepare_send': {
        this.prepareSend(payload);
        break;
      }

      case 'c2s_delete_recv_code': {
        this.deleteRecvCode(payload);
        break;
      }

      case 'c2s_prepare_recv': {
        this.prepareRecv(payload);
        break;
      }
    }
  }

  send(data) {
    this.socket.send(data);
  }

  sendJSON(obj) {
    this.send(JSON.stringify(obj));
  }
}

export default class WebSocketServer {
  constructor(wss, req) {
    this._wss = wss;
    this._req = req;
    this.clients = new Map();

    this.onClientClose = this.onClientClose.bind(this);
  }

  genId() {
    return getRandomString(8);
  }

  onConnection(socket, req) {
    const id = this.genId();
    const client = new Client(id, socket);
    this.clients.set(id, client);
    socket.on('message', msg => this.onMessage(id, msg));
    socket.on('close', () => this.onClientClose(id));
  }

  onMessage(id, _msg) {
    if (typeof _msg === 'string') {
      const client = this.clients.get(id);
      if (!client) {
        console.error('onMessage error, client not found for id: ', id);
        return;
      }
      const msg = JSON.parse(_msg);
      const {
        type,
        payload,
      } = msg;

      switch (type) {
        case 'c2s_signal': {
          const {
            targetId,
            ...others
          } = payload;

          const targetClient = this.clients.get(targetId);
          if (!targetClient) {
            console.log('handling signal, target not found: ', targetId);
            client.sendJSON({
              type: 's2c_error',
              payload: {
                message: '连接失败，对方可能已离线',
              },
            });
            return;
          }
          targetClient.sendJSON({
            type: 's2c_signal',
            payload: {
              srcId: id,
              ...others,
            },
          });
          break;
        }
        default: {
          client.handleMessage(type, payload);
          break;
        }
      }
    } else {
      console.error('received not string message: ', event.data);
    }
  }

  onClientClose(id) {
    this.clients.delete(id);
    const recvCode = clientIdToRecvCodes.get(id);
    clientIdToRecvCodes.delete(id);
    recvCodeToFiles.delete(recvCode);
  }
}
