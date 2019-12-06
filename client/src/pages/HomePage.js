import React from 'react';
import { connect } from 'react-redux';
import produce from 'immer';
import { Input, Button, Upload } from 'antd';
import PropTypes from 'prop-types';
import { prepareUpload, prepareDownload } from '../actions/file';
import SendFileModal from '../components/SendFileModal';
import RecvFileModal from '../components/RecvFileModal';

import styles from './HomePage.cm.styl';

class HomePage extends React.Component {
  constructor() {
    super();
    this.state = {
      downloadCode: '',
      showSendFileModal: false,
      fileList: [],
    };

    this.onChangeFile = this.onChangeFile.bind(this);

    this.onChangeDownloadCode = e => this.setState({ downloadCode: e.target.value });
    this.onClickPrepareDownlod = this.onClickPrepareDownlod.bind(this);

    this.onShowSendFileModal = () => this.setState({ showSendFileModal: true });
    this.onHideSendFileModal = () => this.setState({ showSendFileModal: false, fileList: [] });
  }

  onChangeFile(e) {
    this.setState(produce(draft => {
      draft.fileList.push(e.file);
    }));
    this.onShowSendFileModal();
  }

  onClickPrepareDownlod() {
    this.props.prepareDownload(this.state.downloadCode);
  }

  render() {
    return (
      <div className={styles.content}>
        <div className={styles.left}>
          <h1 className={styles.title}>
            我要收文件
          </h1>
          <Input placeholder="请输入取件码" className={styles.input} onChange={this.onChangeDownloadCode} />
          <Button type="primary" onClick={this.onClickPrepareDownlod}>开始接收</Button>
        </div>
        <div className={styles.right}>
          <h1 className={styles.title}>
            我要发文件
          </h1>
          <Upload
            multiple
            onChange={this.onChangeFile}
            showUploadList={null}
            beforeUpload={() => false}
          >
            <Button type="primary">添加文件</Button>
          </Upload>
        </div>
        <SendFileModal
          isOpen={this.state.showSendFileModal}
          downloadCode={this.props.downloadCode}
          initFileList={this.state.fileList}
          prepareUpload={this.props.prepareUpload}
          onCancel={this.onHideSendFileModal}
        />
        <RecvFileModal
          isOpen={this.props.uploadInfo.files.length > 0}
          message={this.props.uploadInfo.message}
          files={this.props.uploadInfo.files}
        />
      </div>
    );
  }
}

HomePage.defaultProps = {};

HomePage.propTypes = {
  prepareUpload: PropTypes.func,
  prepareDownload: PropTypes.func,
  uploadInfo: PropTypes.object,
  downloadCode: PropTypes.string,
};

function mapStateToProps(state) {
  return {
    downloadCode: state.file.downloadCode,
    uploadInfo: state.file.uploadInfo,
  };
}

export default connect(mapStateToProps, {
  prepareDownload,
  prepareUpload,
})(HomePage);
