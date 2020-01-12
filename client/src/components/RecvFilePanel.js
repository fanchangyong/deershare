import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  withRouter,
} from 'react-router';
import { connect } from 'react-redux';
import prettyBytes from 'pretty-bytes';
import Icon from './common/Icon';
import Button from './common/Button';
import Input from './common/Input';
import FileBox from './FileBox';
import {
  prepareRecv,
} from '../actions/file';
import Peer from '../Peer';

import styles from './RecvFilePanel.cm.styl';

class RecvFilePanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recvCode: '',
      peerConnected: false,
      started: false, // 是否点击了开始下载
    };
    this.onChangeRecvCode = this.onChangeRecvCode.bind(this);
    this.onPrepareRecv = this.onPrepareRecv.bind(this);
    this.onStartRecv = this.onStartRecv.bind(this);
  }

  componentDidMount() {
    const recvCode = this.props.match.params.recvCode;
    if (recvCode) {
      this.props.prepareRecv(recvCode);
    }
  }

  onChangeRecvCode(value) {
    this.setState({ recvCode: value });
  }

  onPrepareRecv() {
    this.props.prepareRecv(this.state.recvCode);
  }

  onStartRecv() {
    this.setState({
      started: true,
    });

    const peer = new Peer();
    peer.on('connecting', () => {
    });

    peer.on('connected', () => {
      this.setState({
        peerConnected: true,
      });
    });

    peer.on('disconnected', () => {
      this.setState({
        peerConnected: false,
      });
    });

    peer.on('connectFailed', () => {
      this.setState({
        peerConnected: false,
      });
    });

    peer.connectPeer(this.props.targetId);
  }

  renderStep1() {
    const {
      recvCode,
    } = this.state;

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
      files,
    } = this.props;

    const {
      peerConnected,
      started,
    } = this.state;

    const totalBytes = files.reduce((sum, cur) => {
      return sum + cur.size;
    }, 0);

    return (
      <>
        <div className={styles.msg1}>
          对方发送给您以下文件：
        </div>
        <FileBox files={this.props.files} />
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
        <div className={styles.title}>
          接收文件
        </div>
        {files.length === 0 && this.renderStep1()}
        {files.length > 0 && this.renderStep2()}
      </div>
    );
  }
}

RecvFilePanel.propTypes = {
  prepareRecv: PropTypes.func,
  files: PropTypes.array,
  targetId: PropTypes.string,
  match: PropTypes.object,
};

function mapStateToProps(state) {
  return {
    files: state.recvFile.files,
    targetId: state.recvFile.targetId,
  };
}

export default withRouter(connect(mapStateToProps, {
  prepareRecv,
})(RecvFilePanel));
