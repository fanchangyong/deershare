import React, { Component, Fragment } from 'react';
import produce from 'immer';
import PropTypes from 'prop-types';
import { message as toast, Modal, Input, Empty, Button, Icon, Upload, Steps } from 'antd';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import QRCode from 'qrcode.react';

import Peer from '../Peer';

import FileChunker from '../FileChunker';
import {
  formatBytes,
} from '../common/util';

import styles from './SendFileModal.cm.styl';

const { Step } = Steps;

function getInitialState(props) {
  return {
    currentStep: 0,
    fileList: props ? props.initFileList : [],
    message: '',
    curFileId: '',
    sendSizes: {},
    peerState: '', // 连接状态
  };
}

class SendFileModal extends Component {
  constructor(props) {
    super(props);

    this.state = getInitialState(props);

    this.onChangeFile = this.onChangeFile.bind(this);
    this.onRemoveFile = this.onRemoveFile.bind(this);
    this.onChangeMessage = this.onChangeMessage.bind(this);

    this.onPrepareUpload = this.onPrepareUpload.bind(this);

    this.renderStep0Content = this.renderStep0Content.bind(this);
    this.renderStep1Content = this.renderStep1Content.bind(this);
    this.renderStep2Content = this.renderStep2Content.bind(this);

    this.sendSizes = {};

    setInterval(() => {
      this.setState(produce(draft => {
        draft.sendSizes = { ...this.sendSizes };
      }));
    }, 1000);
  }

  onPrepareUpload() {
    const {
      message,
      fileList,
    } = this.state;

    this.setState(produce(draft => {
      draft.currentStep = 1;
    }));

    const files = fileList.map(f => {
      return {
        uid: f.uid,
        name: f.name,
        size: f.size,
        type: f.type,
      };
    });

    this.props.prepareUpload(message, files);
    const peer = new Peer();

    peer.on('connecting', () => {
      this.setState({
        peerState: '正在连接',
      });
    });

    peer.on('connected', () => {
      toast.success('已连接');
      this.setState({
        peerState: '已连接',
      });
    });

    peer.on('connectFailed', () => {
      toast.error('连接失败');
      this.setState({
        peerState: '连接失败',
      });
    });

    peer.on('disconnected', async() => {
      toast.error('连接断开');
      this.setState(produce(draft => {
        draft.peerState = '未连接';
      }));
    });

    peer.on('channelOpen', async() => {
      this.setState(produce(draft => {
        if (draft.currentStep === 1) {
          draft.currentStep = 2;
        }
      }));

      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        const uid = file.uid;
        await peer.sendJSON({
          type: 'fileStart',
          fileId: file.uid,
        });
        this.setState({ curFileId: uid });

        const chunker = new FileChunker(file);
        let done = false;
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
            toast.error('传输错误：' + err);
            break;
          }
          this.sendSizes[uid] = offset;
        }

        if (done) {
          await peer.sendJSON({
            type: 'fileEnd',
            fileId: file.uid,
          });
        }
      }
    });
  }

  onChangeFile(e) {
    this.setState(produce(draft => {
      draft.fileList.push(e.file);
    }));
  }

  onChangeMessage(e) {
    this.setState({
      message: e.target.value,
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.initFileList !== prevProps.initFileList) {
      this.setState({
        fileList: this.state.fileList.concat(this.props.initFileList),
      });
    }

    if (!this.props.isOpen && !!prevProps.isOpen) {
      this.setState(getInitialState());
    }
  }

  onRemoveFile(uid) {
    return () => {
      this.setState({
        fileList: this.state.fileList.filter(f => f.uid !== uid),
      });
    };
  }

  renderFileList() {
    const {
      fileList,
    } = this.state;

    return fileList.map(f => {
      return (
        <div key={f.uid} className={styles.fileBox}>
          <span className={styles.fileName}>文件名：{f.name}</span>
          <Icon type="close" className={styles.iconX} onClick={this.onRemoveFile(f.uid)} />
        </div>
      );
    });
  }

  renderStep0Content() {
    const {
      fileList,
    } = this.state;

    return (
      <div>
        {this.state.fileList.length > 0 && (
          <Fragment>
            {this.renderFileList()}
            <Upload
              multiple
              fileList={fileList}
              onChange={this.onChangeFile}
              showUploadList={null}
              beforeUpload={() => false}
            >
              <div className={styles.addMoreFile}>
                <Icon type="plus-circle" className={styles.iconPlus} /> 继续添加文件
              </div>
            </Upload>
          </Fragment>
        )}

        {this.state.fileList.length === 0 && (
          <Empty>
            <Upload
              multiple
              fileList={fileList}
              onChange={this.onChangeFile}
              showUploadList={null}
              beforeUpload={() => false}
            >
              <Button>
                <Icon type="upload" />
                点击上传
              </Button>
            </Upload>
          </Empty>
        )}

        <div className={styles.message}>
          <Input
            placeholder="给对方捎句话（可选）"
            value={this.state.message}
            onChange={this.onChangeMessage}
          />
        </div>
        <Button type="primary" block size="large" onClick={this.onPrepareUpload}>
          下一步
        </Button>
      </div>
    );
  }

  renderStep1Content() {
    const {
      downloadCode,
    } = this.props;

    const downloadLink = `http://${document.location.host}/r/${downloadCode}`;

    return (
      <div>
        <div className={styles.tips}>你可以选择通过以下三种方式之一将文件共享给对方：</div>
        <div>
          <span>
            1. 将链接发送给对方：
          </span>
          <span>{downloadLink}</span>
          <CopyToClipboard text={downloadLink} onCopy={() => toast.success('复制成功')}>
            <Button type="link">复制</Button>
          </CopyToClipboard>
        </div>
        <div>
          <span>
            2. 将取件码发送给对方：
          </span>
          <span>{downloadCode}</span>
          <CopyToClipboard text={downloadCode} onCopy={() => toast.success('复制成功')}>
            <Button type="link">复制</Button>
          </CopyToClipboard>

        </div>
        <div>
          <span>3. 扫描二维码：</span>
          <div className={styles.qrcodeWrapper}>
            <QRCode
              value={downloadLink}
            />
          </div>
        </div>
        <div className={styles.tips}>文件在10分钟内有效，请尽快将收件码或链接发送给对方<br /> 对方输入收件码后会自动开始发送
        </div>
        <Button type="primary" block size="large" loading>
          等待连接...
        </Button>
      </div>
    );
  }

  renderStep2Content() {
    const {
      fileList,
    } = this.state;

    const totalBytes = fileList.reduce((sum, cur) => {
      return sum + cur.size;
    }, 0);

    return (
      <div>
        <h4>正在发送以下文件：</h4>
        <div className={styles.fileBox}>
          {fileList.map(f => {
            const {
              uid,
              name,
              size,
            } = f;

            let uploadPct = null;
            const sendSize = this.state.sendSizes[uid] || 0;
            if (sendSize > 0) {
              uploadPct = ((sendSize / size) * 100).toFixed(2);
            } else {
              uploadPct = '等待中';
            }

            return (
              <div key={uid} className={styles.file}>
                <span className={styles.fileName}>
                  {name}
                </span>
                <span>{formatBytes(size)}</span>
                <span>{uploadPct}%</span>
              </div>
            );
          })}
        </div>
        <div className={styles.summary}>
          {fileList.length} 个文件，共 {formatBytes(totalBytes)}
        </div>
        <Button type="primary" block size="large">
          发送中...
        </Button>
      </div>
    );
  }

  render() {
    const {
      currentStep,
      peerState,
    } = this.state;

    return (
      <div className={styles.base}>
        <Modal
          title="发送文件"
          footer={null}
          visible={this.props.isOpen}
          onCancel={this.props.onCancel}
        >
          <div className={styles.steps}>
            <div>
              连接状态：{peerState}
            </div>
            <Steps current={currentStep}>
              <Step title="添加文件" />
              <Step title="收件码" />
              <Step title="发送" />
            </Steps>
          </div>
          {currentStep === 0 && this.renderStep0Content()}
          {currentStep === 1 && this.renderStep1Content()}
          {currentStep === 2 && this.renderStep2Content()}
        </Modal>
      </div>
    );
  }
}

SendFileModal.propTypes = {
  isOpen: PropTypes.bool,
  initFileList: PropTypes.array,
  downloadCode: PropTypes.string,
  prepareUpload: PropTypes.func,
  onCancel: PropTypes.func,
};

export default SendFileModal;
