import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CopyToClipboard from 'react-copy-to-clipboard';
import prettyBytes from 'pretty-bytes';
import uuidv4 from 'uuid/v4';
import {
  Link,
} from 'react-router-dom';
import QRCode from 'qrcode.react';

import Icon from './common/Icon';
import Button from './common/Button';
import Steps from './common/Steps';
import Toast from './common/Toast';
import FileBox from './FileBox';
import Peer from '../Peer';
import FileChunker from '../FileChunker';
import { calcPercent } from '../common/util';
import { prepareSend } from '../actions/file';

import styles from './SendFilePanel.cm.styl';

const Step = Steps.Step;

class SendFilePanel extends Component {
  constructor(props) {
    super(props);
    this.peer = new Peer();
    this.inputRef = React.createRef();
    this.onClickUpload = this.onClickUpload.bind(this);
    this.onChangeFile = this.onChangeFile.bind(this);
    this.onRemoveFile = this.onRemoveFile.bind(this);
    this.onClickSelectDone = this.onClickSelectDone.bind(this);
    this.onClickBack = this.onClickBack.bind(this);
    this.onReset = this.onReset.bind(this); // 回到初始状态，用在点击取消或发送完成继续发送等地方

    this.sendSizes = {};
    this.bps = 0;

    this.timer = setInterval(() => {
      const files = this.props.files.map(f => {
        const sendSize = this.sendSizes[f.uid] || 0;
        const pct = calcPercent(sendSize, f.size);
        return {
          ...f,
          pct,
        };
      });

      this.props.setState({ files, bps: this.bps });
      this.bps = 0;
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  onClickUpload() {
    this.inputRef.current.click();
  }

  onClickSelectDone() {
    this.props.setState({
      curStep: 2,
    });

    const files = this.props.files.map(f => {
      return {
        uid: f.uid,
        name: f.name,
        size: f.size,
        type: f.type,
      };
    });
    prepareSend(files);

    const peer = this.peer;

    peer.on('connecting', () => {
      this.props.setState({
        peerState: 'connecting',
      });
    });

    peer.on('connected', () => {
      this.props.setState({
        peerState: 'connected',
      });
    });

    peer.on('connectFailed', () => {
      this.props.setState({
        peerState: 'connectFailed',
      });
      Toast.error('连接失败');
    });

    peer.on('disconnected', async() => {
      this.props.setState({
        peerState: 'disconnected',
      });
      Toast.error('连接断开，请重试');
    });

    peer.on('channelOpen', async() => {
      this.props.setState({
        curStep: 3,
        peerState: 'transfer',
      });

      const files = this.props.files;
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileId = file.uid;
        await peer.sendJSON({
          type: 'fileStart',
          fileId,
        });

        this.props.setState({
          curFileId: fileId,
        });

        const chunker = new FileChunker(file.realFile);
        let done = false;
        let lastOffset = 0;
        while (!done) {
          const result = await chunker.getNextChunk();
          done = result.done;
          const {
            chunk,
            offset,
          } = result;
          try {
            await peer.send(chunk);
          } catch (err) {
            Toast.error('传输错误：' + err);
            break;
          }
          this.sendSizes[fileId] = offset;
          this.bps += (offset - lastOffset);
          lastOffset = offset;
        }
        if (done) {
          await peer.sendJSON({
            type: 'fileEnd',
            fileId,
          });
        }
      }
    });
  }

  onClickBack() {
    this.props.setState({ curStep: this.props.curStep - 1 });
  }

  onReset() {
    this.peer.destroy();
    this.props.setState({
      curStep: 1,
      files: [],
      peerState: '',
    });
  }

  onChangeFile(event) {
    const files = Array.from(event.target.files);

    const filteredFiles = files.filter(f => {
      const existed = this.props.files.find(f1 => {
        if (f1.name === f.name && f1.size === f.size && f1.lastModified === f.lastModified && f1.type === f.type) {
          return true;
        }
        return false;
      });
      return !existed;
    }).map(f => {
      return {
        realFile: f,
        uid: uuidv4(),
        name: f.name,
        size: f.size,
        type: f.type,
      };
    });

    if (filteredFiles.length !== files.length) {
      Toast.info('发现疑似相同的文件，已自动过滤');
    }

    const nextFiles = this.props.files.concat(filteredFiles);
    this.props.setState({
      files: nextFiles,
    });
    event.target.value = null;
  }

  onRemoveFile(uid) {
    return () => {
      const nextFiles = this.props.files.filter(f => f.uid !== uid);
      this.props.setState({ files: nextFiles });
    };
  }

  renderStep1() {
    const {
      files,
    } = this.props;

    const totalBytes = files.reduce((sum, cur) => {
      return sum + cur.size;
    }, 0);

    if (files.length === 0) {
      return (
        <>
          <div className={styles.uploadArea}>
            <div className={styles.iconPlusWrapper}>
              <Icon name="plus" className={styles.iconPlus} />
            </div>
            <div className={styles.uploadTip}>
              将文件拖动到方框内或点击下方按钮
            </div>
            <Button
              type="primary"
              className={styles.uploadBtn}
              onClick={this.onClickUpload}
            >
              上传文件
            </Button>
          </div>
          <div className={styles.recvGuide}>
            已有收件码？点击
            <Link to="/recv" className={styles.link}> 接收文件</Link>
          </div>
        </>
      );
    } else {
      return (
        <>
          <div className={styles.uploadArea}>
            <FileBox
              files={files}
              removable
              onRemoveFile={this.onRemoveFile}
            />
          </div>
          <div className={styles.uploadMore}>
            <div className={styles.addMore} onClick={this.onClickUpload}>
              <span>添加文件</span>
            </div>
            <div className={styles.fileSummary}>{files.length} 个文件，共 {prettyBytes(totalBytes)}</div>
          </div>
          <Button type="primary" className={styles.btnSelectFileDone} onClick={this.onClickSelectDone}>
            选好了
          </Button>
        </>
      );
    }
  }

  renderStep2() {
    const {
      recvCode,
    } = this.props;

    const recvLink = `http://${document.location.host}/recv/${recvCode}`;

    return (
      <>
        <div className={styles.selectSendMethod}>
          请选择发送方式：
        </div>
        <div className={styles.sendMethod1}>
          1. 通过链接发送（对方打开链接即可下载文件）
        </div>
        <div className={styles.recvLinkContainer}>
          <span className={styles.recvLink}>
            {recvLink}
          </span>
          <CopyToClipboard text={recvLink} onCopy={() => Toast.success('复制成功')}>
            <span className={styles.btnCopy}>
              复制
            </span>
          </CopyToClipboard>
        </div>
        <div>
          2. 通过6位数取件码（对方在小鹿快传网站输入即可下载文件）
        </div>
        <div className={styles.recvCodeContainer}>
          <span className={styles.recvCode}>
            {recvCode}
          </span>
          <CopyToClipboard text={recvCode} onCopy={() => Toast.success('复制成功')}>
            <span className={styles.btnCopy}>
              复制
            </span>
          </CopyToClipboard>
        </div>
        <div>
          3. 扫描下方二维码：
        </div>
        <div className={styles.qrcodeContainer}>
          <QRCode value={recvLink} />
        </div>

        <div className={styles.connectTips}>
          温馨提示：<br />
          以上取件码在10分钟内有效，请尽快发送给对方 <br />
          对方输入取件码并确认之后会自动开始发送
        </div>
        <Button type="primary" className={styles.btnWaitConnect} disabled>
          等待连接...
        </Button>
      </>
    );
  }

  renderStep3() {
    const {
      curFileId,
      files,
      peerState,
    } = this.props;

    const totalBytes = files.reduce((sum, cur) => {
      return sum + cur.size;
    }, 0);

    let allCompleted = true;
    files.forEach(f => {
      if (f.pct < 100) {
        allCompleted = false;
      }
    });

    let btnContent;
    if (allCompleted) {
      btnContent = '继续发送';
    } else if (peerState === 'connecting') {
      btnContent = '正在连接...';
    } else if (peerState === 'connected') {
      btnContent = '连接成功';
    } else if (peerState === 'transfer') {
      btnContent = `正在发送...(${prettyBytes(this.bps || 0)}/s)`;
    } else if (peerState === 'disconnected' || peerState === 'connectFailed') {
      btnContent = '连接断开，等待重连...';
    }

    let btnDisabled = true;
    if (allCompleted) {
      btnDisabled = false;
    }

    return (
      <>
        <div className={styles.sendingBox}>
          <FileBox files={files} curFileId={curFileId} />
        </div>
        <div className={styles.sendingSummary}>
          <div>{files.length}个文件，共{prettyBytes(totalBytes)}</div>
        </div>
        <Button type="primary" className={styles.btnSending} disabled={btnDisabled} onClick={this.onReset}>
          {btnContent}
        </Button>
      </>
    );
  }

  render() {
    const {
      curStep,
      files,
    } = this.props;

    return (
      <div className={styles.base}>
        <div className={styles.titleRow}>
          {((curStep === 1 && files.length > 0) || (curStep === 3)) && (
            <div className={styles.back} onClick={this.onReset}>
              取消
            </div>
          )}
          {curStep === 2 && (
            <div className={styles.back} onClick={this.onClickBack}>
              返回
            </div>
          )}
          <div className={styles.title}>
            发送文件
          </div>
        </div>
        <Steps>
          <Step
            index={1}
            title="选择文件"
            active={curStep === 1}
          />
          <Step index={2} title="收件码" active={curStep === 2} />
          <Step index={3} title="发送" active={curStep === 3} />
        </Steps>
        {curStep === 1 && this.renderStep1()}
        {curStep === 2 && this.renderStep2()}
        {curStep === 3 && this.renderStep3()}
        <input type="file" hidden ref={this.inputRef} onChange={this.onChangeFile} multiple />
      </div>
    );
  }
}

SendFilePanel.propTypes = {
  curStep: PropTypes.number,
  files: PropTypes.array,
  curFileId: PropTypes.string,
  peerState: PropTypes.string,
  recvCode: PropTypes.string,
  setState: PropTypes.func,
};

export default SendFilePanel;
