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
      fileList: props.initFileList,
    };

    this.onChangeFile = this.onChangeFile.bind(this);
    this.onRemoveFile = this.onRemoveFile.bind(this);
  }

  onChangeFile(e) {
    this.setState(produce(draft => {
      draft.fileList.push(e.file);
    }));
  }

  componentDidUpdate(prevProps) {
    if (this.props.initFileList !== prevProps.initFileList) {
      this.setState({
        fileList: this.state.fileList.concat(this.props.initFileList),
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

  render() {
    const {
      fileList,
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
            <Steps current={0}>
              <Step title="添加文件" />
              <Step title="收件码" />
              <Step title="发送" />
            </Steps>
          </div>

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

          <Button type="primary" block size="large">
            下一步
          </Button>
        </Modal>
      </div>
    );
  }
}

export default SendFileModal;
