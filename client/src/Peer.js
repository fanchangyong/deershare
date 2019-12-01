import EventEmitter from 'eventemitter3';

export default class Peer extends EventEmitter {
  constructor(webSocket) {
    super();
    this.id = null;
    this.targetId = null;
    this.webSocket = webSocket;
    this.pc = null; // RTCPeerConnection
    this.dc = null; // RTCDataChannel

    this.handleWSMessage = this.handleWSMessage.bind(this);
    this.onIceCandidate = this.onIceCandidate.bind(this);
    this.onChannelOpen = this.onChannelOpen.bind(this);
    this.onDescription = this.onDescription.bind(this);
    this.connectPeer = this.connectPeer.bind(this);
    this.onIceConnectionStateChange = this.onIceConnectionStateChange.bind(this);
    this.onConnectionStateChange = this.onConnectionStateChange.bind(this);
    this.onRTCMessage = this.onRTCMessage.bind(this);
    this.onChannelOpen = this.onChannelOpen.bind(this);
    this.onChannelClose = this.onChannelClose.bind(this);

    this.webSocket.on('message', this.handleWSMessage);
  }

  onDescription(description) {
    this.pc.setLocalDescription(description)
    .then(() =>{
      this.webSocket.sendObject({
        type: 'C2S_SIGNAL',
        payload: {
          targetId: this.targetId,
          sdp: description,
        }
      });
    })
    .catch(e => console.log('onDescription error: ', e));
  }

  onIceConnectionStateChange(e) {
    if (this.pc.iceConnectionState === 'failed') {
      console.error('ICE Gathering failed');
    } else {
      console.log('ICE Gathering: ', this.pc.iceConnectionState);
    }
  }

  onConnectionStateChange(e) {
    console.log('onConnectionStateChange: ', e)
  }

  onRTCMessage(e) {
    this.emit('data', e.data);
  }

  createRTCConnection(isCaller) {
    const config = {
      iceServers: [
        {
          urls: 'stun:stun.l.google.com:19302',
        },
        {
          urls: 'turn:0.peerjs.com:3478',
          username: 'peerjs',
          credential: 'peerjsp',
        }
      ]
    };
    const pc = new RTCPeerConnection(config);
    this.pc = pc;
    pc.onicecandidate = this.onIceCandidate;
    pc.onconnectionstatechange = e => this.onConnectionStateChange(e);
    pc.oniceconnectionstatechange = e=> this.onIceConnectionStateChange(e);

    if (isCaller) {
      const dc = pc.createDataChannel('data-channel', { reliable: true })
      this.dc = dc;
      dc.binaryType = 'arraybuffer';
      dc.onopen = this.onChannelOpen;
      dc.onclose = this.onChannelClose;
      dc.onerror = this.onChannelError;
      pc.createOffer()
      .then(description => {
        return this.onDescription(description);
      });
    } else {
      this.pc.ondatachannel = e => {
        const dc = e.channel || e.target;
        this.dc = dc;
        dc.onopen = this.onChannelOpen;
        dc.onclose = this.onChannelClose;
        dc.onerror = this.onChannelError;
      }
    }
  }

  handleWSMessage(msg) {
    const type = msg.type;
    const payload = msg.payload;
    switch(type) {
      case 'S2C_OPEN': {
        this.id = payload.id;
        this.emit('peerId', this.id)
        return;
      }

      case 'S2C_SIGNAL': {
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
              return this.pc.createAnswer()
              .then(d => this.onDescription(d));
            }
          })
        } else if (payload.ice) {
          this.pc.addIceCandidate(new RTCIceCandidate(payload.ice));
        }
      }
    }
  }

  connectPeer(targetId) {
    this.targetId = targetId;
    this.createRTCConnection(true);
  }

  onIceCandidate(e) {
    if (!e.candidate) {
      return;
    }

    this.webSocket.sendObject({
      type: 'C2S_SIGNAL',
      payload: {
        targetId: this.targetId,
        ice: e.candidate,
      },
    });
  }

  onChannelOpen(e) {
    this.emit('connected');
    this.dc.onmessage = this.onRTCMessage;
  }

  onChannelClose(e) {
    console.log('## channel close: ', e)
  }

  onChannelError(e) {
    console.log('## channel error: ', e)
  }

  send(data) {
    if (this.dc.readyState === 'open') {
      try {
        this.dc.send(data);
      } catch (e) {
        console.log('send error: ', e)
      }
    }
  }
}
