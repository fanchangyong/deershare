import React, { Component, Fragment } from 'react';
import produce from 'immer';
import PropTypes from 'prop-types';
import { Modal, Input, Empty, Button, Icon, Upload, Steps } from 'antd';
import styles from './SendFileModal.cm.styl';

const { Step } = Steps;

class SendFileModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentStep: 0,
      fileList: props.initFileList,
    };

    this.onChangeFile = this.onChangeFile.bind(this);
    this.onRemoveFile = this.onRemoveFile.bind(this);
    this.onNextStep = this.onNextStep.bind(this);

    this.renderStep0Content = this.renderStep0Content.bind(this);
    this.renderStep1Content = this.renderStep1Content.bind(this);
    this.renderStep2Content = this.renderStep2Content.bind(this);
  }

  onNextStep() {
    this.setState(produce(draft => {
      draft.currentStep += 1;
    }));
  }

  onChangeFile(e) {
    this.setState(produce(draft => {
      draft.fileList.push(e.file);
    }));
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.initFileList !== prevProps.initFileList) {
      this.setState({
        fileList: this.state.fileList.concat(this.props.initFileList),
      });
    }

    if (!this.props.isOpen && !!prevProps.isOpen) {
      this.setState({
        fileList: [],
      });
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

        <div className={styles.talk}>
          <Input placeholder="给对方捎句话（可选）" />
        </div>
      </div>
    );
  }

  renderStep1Content() {
    return (
      <div>
        <div>你可以选择通过以下三种方式之一将文件共享给对方：</div>
        <div>
          <span>
            1. 将链接发送给对方：
          </span>
          <span>https://deershare.com/s/ssjk78L</span>
          <Button type="link">复制</Button>
        </div>
        <div>
          <span>
            2. 将取件码发送给对方：
          </span>
          <span>ssjk78L</span>
          <Button type="link">复制</Button>
        </div>
        <div>
          <span>3. 扫描二维码：</span>
          <img className={styles.qrcode} src="https://s2.ax1x.com/2019/12/03/QMldf0.png" alt="" />
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
      fileList,
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
            <Button type="primary" block size="large" onClick={this.onNextStep}>
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

export default SendFileModal;
