import EventEmitter from 'eventemitter3';
import ws from './ws';

const BUFFERED_AMOUNT_LOW_THRESHOLD = 14 * 1024 * 1024; // 8MB
const BUF_WAITING_THRESHOLD = 15 * 1024 * 1024;

export default class Peer extends EventEmitter {
  constructor() {
    super();
    this.id = null; // not used
    this.targetId = null;
    this.pc = null; // RTCPeerConnection
    this.dc = null; // RTCDataChannel
    this.waitingCallback = null;

    this.onIceCandidate = this.onIceCandidate.bind(this);
    this.onDescription = this.onDescription.bind(this);
    this.connectPeer = this.connectPeer.bind(this);
    this.onConnectionStateChange = this.onConnectionStateChange.bind(this);
    this.onRTCMessage = this.onRTCMessage.bind(this);
    this.onChannelOpen = this.onChannelOpen.bind(this);
    this.onChannelClose = this.onChannelClose.bind(this);
    this.onBufferedAmountLow = this.onBufferedAmountLow.bind(this);

    this.onS2cSignal = this.onS2cSignal.bind(this);
    this.onS2cOpen = this.onS2cOpen.bind(this);
    ws.registerMessageHandler('s2c_open', this.onS2cOpen);
    ws.registerMessageHandler('s2c_signal', this.onS2cSignal);
  }

  onS2cOpen(payload) {
    this.id = payload.id;
    this.emit('peerId', this.id);
  }

  onS2cSignal(payload) {
    if (!this.targetId) {
      this.targetId = payload.srcId;
    }
    if (!this.pc) {
      this.createRTCConnection(false);
    }
    if (payload.sdp) {
      this.pc.setRemoteDescription(new RTCSessionDescription(payload.sdp))
      .then(_ => {
        if (payload.sdp.type === 'offer') {
          return this.makeAnswer();
        }
      });
    } else if (payload.ice) {
      this.pc.addIceCandidate(new RTCIceCandidate(payload.ice));
    }
  }

  onDescription(description) {
    this.pc.setLocalDescription(description)
    .then(() => {
      ws.sendJSON({
        type: 'c2s_signal',
        payload: {
          targetId: this.targetId,
          sdp: description,
        },
      });
    })
    .catch(e => console.log('onDescription error: ', e));
  }

  onConnectionStateChange() {
    if (this.pc.connectionState === 'disconnected') {
      if (this.dc) {
        this.dc.close();
      }
      if (this.waitingCallback) {
        this.waitingCallback(new Error('peer disconnected, cannot send'));
        this.waitingCallback = null;
      }
      this.emit('disconnected');
    } else if (this.pc.connectionState === 'connected') {
      this.emit('connected');
    } else if (this.pc.connectionState === 'connecting') {
      this.emit('connecting');
    } else if (this.pc.connectionState === 'failed') {
      this.emit('connectFailed');
    }
    console.log('onConnectionStateChange: ', this.pc.connectionState);
  }

  onRTCMessage(e) {
    this.emit('data', e.data);
  }

  createRTCConnection(isCaller) {
    const config = {
      iceServers: [
        {
          urls: 'stun:0.peerjs.com:3478',
        },
        // {
        //   urls: 'turn:0.peerjs.com:3478',
        //   username: 'peerjs',
        //   credential: 'peerjsp',
        // },
      ],
    };
    const pc = new RTCPeerConnection(config);
    this.pc = pc;
    pc.onconnectionstatechange = e => this.onConnectionStateChange(e);
    pc.onicecandidate = this.onIceCandidate;

    if (isCaller) {
      const dc = pc.createDataChannel('file-transfer', { ordered: true });
      this.setupDataChannel(dc);
      this.makeOffer();
    } else {
      this.pc.ondatachannel = e => {
        const dc = e.channel || e.target;
        this.setupDataChannel(dc);
      };
    }
  }

  setupDataChannel(dc) {
    this.dc = dc;
    dc.bufferedAmountLowThreshold = BUFFERED_AMOUNT_LOW_THRESHOLD;
    dc.binaryType = 'arraybuffer';
    dc.onopen = this.onChannelOpen;
    dc.onclose = this.onChannelClose;
    dc.onerror = this.onChannelError;
    dc.onbufferedamountlow = this.onBufferedAmountLow;
  }

  makeOffer() {
    this.pc.createOffer()
    .then(description => {
      return this.onDescription(description);
    });
  }

  makeAnswer() {
    return this.pc.createAnswer()
    .then(d => this.onDescription(d));
  }

  connectPeer(targetId) {
    this.targetId = targetId;
    this.createRTCConnection(true);
  }

  destroy() {
    this.targetId = null;
    this.waitingCallback = null;
    if (this.pc) {
      this.pc.close();
      this.pc = null;
    }
    if (this.dc) {
      this.dc.close();
      this.dc = null;
    }
    this.removeAllListeners();
  }

  onIceCandidate(e) {
    if (!e.candidate) {
      return;
    }

    ws.sendJSON({
      type: 'c2s_signal',
      payload: {
        targetId: this.targetId,
        ice: e.candidate,
      },
    });
  }

  onChannelOpen(e) {
    this.emit('channelOpen');
    this.dc.onmessage = this.onRTCMessage;
  }

  onChannelClose(e) {
    console.log('## channel close: ', e);
  }

  onChannelError(e) {
    console.log('## channel error: ', e);
  }

  onBufferedAmountLow() {
    if (this.waitingCallback) {
      this.waitingCallback();
      this.waitingCallback = null;
    }
  }

  send(data) {
    return new Promise((resolve, reject) => {
      if (this.dc.readyState === 'open') {
        if (this.dc.bufferedAmount >= BUF_WAITING_THRESHOLD) {
          this.waitingCallback = (err) => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          };
        } else {
          try {
            this.dc.send(data);
            resolve();
          } catch (e) {
            console.error('send error: ', e);
            reject(e);
          }
        }
      } else {
        const errMsg = 'send but channel is not open, now state is: ' + this.dc.readyState;
        console.error(errMsg);
        reject(new Error(errMsg));
      }
    });
  }

  sendJSON(obj) {
    return this.send(JSON.stringify(obj));
  }
}
