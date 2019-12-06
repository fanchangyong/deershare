import React, { Component } from 'react';
import PropTypes from 'prop-types';
import produce from 'immer';
import { Modal, Button } from 'antd';
import Peer from '../Peer';
import {
  getWebSocket,
} from '../WebSocket';
import {
  formatBytes,
} from '../common/util';

import styles from './RecvFileModal.cm.styl';

class DownloadFileModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      receivingFileId: null,
      downloadUrls: {},
      recvSizes: {},
    };

    this.onDownload = this.onDownload.bind(this);
    this.onRecvData = this.onRecvData.bind(this);
    this.handleMsg = this.handleMsg.bind(this);

    this.recvBuffer = [];
    this.recvSizes = {};

    setInterval(() => {
      this.setState(produce(draft => {
        draft.recvSizes = { ...this.recvSizes };
      }));
    }, 1000);
  }

  onDownload() {
    const ws = getWebSocket();
    const peer = new Peer(ws);
    peer.connectPeer(this.props.targetId);
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
      // this.setState(produce(draft => {
      //   const curRecvBytes = draft.recvSizes[draft.receivingFileId] || 0;
      //   const newRecvBytes = curRecvBytes + data.byteLength;
      //   draft.recvSizes[draft.receivingFileId] = newRecvBytes;
      // }));
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
      message,
      files,
    } = this.props;

    // const isOpen = true;
    // const message = 'test message';
    // const files = [
    //   {
    //     uid: '1',
    //     name: 'file1.txt',
    //     size: 102400,
    //   },
    //   {
    //     uid: '2',
    //     name: 'file2.txt',
    //     size: 102400,
    //   },
    // ];

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

DownloadFileModal.propTypes = {
  isOpen: PropTypes.bool,
  targetId: PropTypes.string,
  message: PropTypes.string,
  files: PropTypes.array,
  onCancel: PropTypes.func,
};

export default DownloadFileModal;
