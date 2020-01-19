import React, { Component } from 'react';
import PropTypes from 'prop-types';
import prettyBytes from 'pretty-bytes';
import { withRouter } from 'react-router-dom';
import Icon from './common/Icon';
import Button from './common/Button';
import Input from './common/Input';
import FileBox from './FileBox';
import Toast from './common/Toast';
import {
  prepareRecv,
} from '../actions/file';
import Peer from '../Peer';
import {
  calcPercent,
} from '../common/util';

import styles from './RecvFilePanel.cm.styl';

class RecvFilePanel extends Component {
  constructor(props) {
    super(props);
    this.onChangeRecvCode = this.onChangeRecvCode.bind(this);
    this.onPrepareRecv = this.onPrepareRecv.bind(this);
    this.onStartRecv = this.onStartRecv.bind(this);
    this.onCancel = this.onCancel.bind(this);

    this.onRecvData = this.onRecvData.bind(this);
    this.handleMsg = this.handleMsg.bind(this);

    this.peer = new Peer();
    this.recvBuffer = [];
    this.recvSizes = {};

    this.timer = setInterval(() => {
      const files = this.props.files.map(f => {
        const recvSize = this.recvSizes[f.uid] || 0;
        const pct = calcPercent(recvSize, f.size);
        return {
          ...f,
          pct,
        };
      });
      this.props.setState({
        files,
      });
    }, 1000);
  }

  componentDidMount() {
    const recvCode = this.props.match.params.recvCode;
    if (recvCode) {
      prepareRecv(recvCode);
    }
  }

  componentWillUnMount() {
    clearInterval(this.timer);
  }

  onChangeRecvCode(value) {
    this.props.setState({ recvCode: value });
  }

  onPrepareRecv() {
    prepareRecv(this.props.recvCode);
  }

  onCancel() {
    this.peer.destroy();
    this.props.setState({
      recvCode: '',
      peerConnected: false,
      started: false,
      files: [],
      targetId: '',
    });
  }

  onStartRecv() {
    this.props.setState({
      started: true,
    });

    const peer = this.peer;

    peer.on('connecting', () => {
    });

    peer.on('connected', () => {
      Toast.success('连接成功');
      this.props.setState({
        peerConnected: true,
      });
    });

    peer.on('disconnected', () => {
      Toast.error('连接已断开');
      this.props.setState({
        peerConnected: false,
      });
    });

    peer.on('connectFailed', () => {
      Toast.error('连接失败，请重试');
      this.props.setState({
        peerConnected: false,
      });
    });

    peer.on('data', this.onRecvData);

    peer.connectPeer(this.props.targetId);
  }

  onRecvData(data) {
    const {
      curFileId,
    } = this.props;

    if (typeof data === 'string') {
      const msg = JSON.parse(data);
      this.handleMsg(msg);
    } else {
      this.recvBuffer.push(data);
      const curRecvBytes = this.recvSizes[curFileId] || 0;
      const newRecvBytes = curRecvBytes + data.byteLength;
      this.recvSizes[curFileId] = newRecvBytes;
    }
  }

  handleMsg(msg) {
    if (msg.type === 'fileStart') {
      this.props.setState({
        curFileId: msg.fileId,
      });
    } else if (msg.type === 'fileEnd') {
      const fileId = msg.fileId;
      const blob = new Blob(this.recvBuffer);
      const url = window.URL.createObjectURL(blob);
      const files = this.props.files.map(f => {
        if (f.uid === fileId) {
          return {
            ...f,
            downloadUrl: url,
          };
        } else {
          return f;
        }
      });
      this.props.setState({
        files,
      });
    }
  }

  renderStep1() {
    const {
      recvCode,
    } = this.props;

    return (
      <>
        <Input placeholder="请输入6位收件码" inputClassName={styles.input} value={recvCode} onChange={this.onChangeRecvCode} />
        <Button type="primary" className={styles.recvBtn} onClick={this.onPrepareRecv}>接收文件</Button>
        <div className={styles.tip}>
          <Icon name="info" />
          如何获取收件码？
        </div>
      </>
    );
  }

  renderStep2() {
    const {
      peerConnected,
      started,
      curFileId,
      files,
    } = this.props;

    const totalBytes = files.reduce((sum, cur) => {
      return sum + cur.size;
    }, 0);

    return (
      <>
        <div className={styles.msg1}>
          对方发送给您以下文件：
        </div>
        <FileBox files={this.props.files} curFileId={curFileId} />
        <div className={styles.msg2}>
          <div>{files.length} 个文件，共 {prettyBytes(totalBytes)}</div>
          {!!started && <div className={peerConnected ? styles.peerConnected : styles.peerNotConnected}>{peerConnected ? '已连接' : '未连接'}</div>}
        </div>
        {!started && (
          <Button
            type="primary"
            className={styles.recvBtn}
            onClick={this.onStartRecv}
          >
            开始下载
          </Button>
        )}
        {!!started && (
          <Button
            type="primary"
            className={styles.recvBtn}
            disabled
          >
            正在接收...(3.5MB/s)
          </Button>
        )}
      </>
    );
  }

  render() {
    const {
      files,
    } = this.props;

    return (
      <div className={styles.base}>
        <div className={styles.titleRow}>
          {files.length > 0 && (
            <div className={styles.cancel} onClick={this.onCancel}>
              取消
            </div>
          )}
          <div className={styles.title}>
            接收文件
          </div>
        </div>
        {files.length === 0 && this.renderStep1()}
        {files.length > 0 && this.renderStep2()}
      </div>
    );
  }
}

RecvFilePanel.propTypes = {
  recvCode: PropTypes.string,
  peerConnected: PropTypes.bool,
  started: PropTypes.bool,
  files: PropTypes.array,
  targetId: PropTypes.string,
  curFileId: PropTypes.string,
  match: PropTypes.object,
  setState: PropTypes.func,
};

export default withRouter(RecvFilePanel);
