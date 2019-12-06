import React, { Component, Fragment } from 'react';
import produce from 'immer';
import PropTypes from 'prop-types';
import { message, Modal, Input, Empty, Button, Icon, Upload, Steps } from 'antd';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import QRCode from 'qrcode.react';

import styles from './SendFileModal.cm.styl';

const { Step } = Steps;

function getInitialState(props) {
  return {
    currentStep: 0,
    fileList: props ? props.initFileList : [],
    message: '',
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
  }

  onPrepareUpload() {
    const {
      message,
      fileList,
    } = this.state;

    this.setState(produce(draft => {
      draft.currentStep += 1;
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
      </div>
    );
  }

  renderStep1Content() {
    const {
      downloadCode,
    } = this.props;

    const downloadLink = `https://deershare.com/s/${downloadCode}`;

    return (
      <div>
        <div className={styles.tips}>你可以选择通过以下三种方式之一将文件共享给对方：</div>
        <div>
          <span>
            1. 将链接发送给对方：
          </span>
          <span>{downloadLink}</span>
          <CopyToClipboard text={downloadLink} onCopy={() => message.success('复制成功')}>
            <Button type="link">复制</Button>
          </CopyToClipboard>
        </div>
        <div>
          <span>
            2. 将取件码发送给对方：
          </span>
          <span>{downloadCode}</span>
          <CopyToClipboard text={downloadCode} onCopy={() => message.success('复制成功')}>
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
      </div>
    );
  }

  renderStep2Content() {

  }

  render() {
    const {
      currentStep,
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
            <Steps current={currentStep}>
              <Step title="添加文件" />
              <Step title="收件码" />
              <Step title="发送" />
            </Steps>
          </div>
          {currentStep === 0 && this.renderStep0Content()}
          {currentStep === 1 && this.renderStep1Content()}
          {currentStep === 2 && this.renderStep2Content()}

          {currentStep === 0 && (
            <Button type="primary" block size="large" onClick={this.onPrepareUpload}>
              下一步
            </Button>
          )}

          {currentStep === 1 && (
            <Button type="primary" block size="large" loading>
              等待对方...
            </Button>
          )}

          {currentStep === 2 && (
            <Button type="primary" block size="large">
              发送中...
            </Button>
          )}
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
