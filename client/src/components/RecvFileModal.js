import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import produce from 'immer';
import { Modal, Button, message } from 'antd';
import Peer from '../Peer';
import ws from '../ws';

import {
  formatBytes,
} from '../common/util';

import styles from './RecvFileModal.cm.styl';

class RecvFileModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      receivingFileId: null,
      downloadUrls: {},
      recvSizes: {},
      targetId: '',
      message: '',
      files: [],
      peerState: '',
    };

    this.onDownload = this.onDownload.bind(this);
    this.onRecvData = this.onRecvData.bind(this);
    this.handleMsg = this.handleMsg.bind(this);
    this.handlePrepareDownloadRes = this.handlePrepareDownloadRes.bind(this);

    this.recvBuffer = [];
    this.recvSizes = {};

    this.timer = setInterval(() => {
      this.setState(produce(draft => {
        draft.recvSizes = { ...this.recvSizes };
      }));
    }, 1000);
  }

  componentDidMount() {
    ws.sendJSON({
      type: 'c2s_prepare_download',
      payload: {
        downloadCode: this.props.match.params.downloadCode,
      },
    });
    ws.registerMessageHandler('s2c_prepare_download', this.handlePrepareDownloadRes);
  }

  handlePrepareDownloadRes(payload) {
    this.setState(produce(draft => {
      draft.showRecvFileModal = true;
      draft.targetId = payload.clientId;
      draft.message = payload.message;
      draft.files = payload.files;
    }));
    ws.removeMessageHandler('s2c_prepare_download', this.handlePrepareDownloadRes);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  onDownload() {
    const peer = new Peer();

    peer.on('connecting', () => {
      this.setState({
        peerState: '正在连接',
      });
    });

    peer.on('connected', () => {
      message.success('已连接');
      this.setState({
        peerState: '已连接',
      });
    });

    peer.on('disconnected', async() => {
      message.error('连接断开');
      this.setState(produce(draft => {
        draft.peerState = '未连接';
      }));
    });

    peer.on('connectFailed', () => {
      message.error('连接失败');
      this.setState({
        peerState: '连接失败',
      });
    });

    peer.connectPeer(this.state.targetId);
    peer.on('data', this.onRecvData);
  }

  onRecvData(data) {
    if (typeof data === 'string') {
      const msg = JSON.parse(data);
      this.handleMsg(msg);
    } else {
      this.recvBuffer.push(data);
      const curRecvBytes = this.recvSizes[this.state.receivingFileId] || 0;
      const newRecvBytes = curRecvBytes + data.byteLength;
      this.recvSizes[this.state.receivingFileId] = newRecvBytes;
    }
  }

  handleMsg(msg) {
    if (msg.type === 'fileStart') {
      this.setState({
        receivingFileId: msg.fileId,
      });
    } else if (msg.type === 'fileEnd') {
      const fileId = msg.fileId;
      const blob = new Blob(this.recvBuffer);
      const url = window.URL.createObjectURL(blob);
      this.setState(produce(draft => {
        draft.downloadUrls[fileId] = url;
      }));
    }
  }

  render() {
    const {
      isOpen,
    } = this.props;

    const {
      message,
      files,
    } = this.state;

    if (!isOpen) {
      return null;
    }

    const totalBytes = files.reduce((sum, cur) => {
      return sum + cur.size;
    }, 0);

    return (
      <div className={styles.base}>
        <Modal
          title="接收文件"
          footer={null}
          visible={isOpen}
          onCancel={this.props.onCancel}
        >
          <h4>对方发送给您以下文件及信息：</h4>
          {!!message && (
            <div className={styles.message}>{message}</div>
          )}
          <div className={styles.fileBox}>
            {files.map(f => {
              const {
                uid,
                name,
                size,
              } = f;
              const downloadUrl = this.state.downloadUrls[uid];
              const recvBytes = this.state.recvSizes[uid] || 0;

              let downloadInfo = null;
              if (downloadUrl) {
                downloadInfo = <a href={downloadUrl} download={name}>下载</a>;
              } else if (uid === this.state.receivingFileId) {
                downloadInfo = <span>{((recvBytes / size) * 100).toFixed(2)}%</span>;
              } else {
                downloadInfo = <span>等待中</span>;
              }

              return (
                <div key={uid} className={styles.file}>
                  <span className={styles.fileName}>
                    {name}
                  </span>
                  <span>{formatBytes(size)}</span>
                  {downloadInfo}
                </div>
              );
            })}
          </div>
          <div className={styles.summary}>
            {files.length} 个文件，共 {formatBytes(totalBytes)}
          </div>
          <Button type="primary" block size="large" onClick={this.onDownload}>
            开始下载
          </Button>
        </Modal>
      </div>
    );
  }
}

RecvFileModal.propTypes = {
  isOpen: PropTypes.bool,
  onCancel: PropTypes.func,
  match: PropTypes.object,
};

export default withRouter(RecvFileModal);
