import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import {
  Route,
} from 'react-router-dom';
import produce from 'immer';
import { Input, Button, Upload } from 'antd';
import PropTypes from 'prop-types';
import { prepareUpload } from '../actions/file';
import {
  getWebSocket,
} from '../WebSocket';
import SendFileModal from '../components/SendFileModal';
import RecvFileModal from '../components/RecvFileModal';

import styles from './HomePage.cm.styl';

class HomePage extends React.Component {
  constructor() {
    super();
    this.state = {
      downloadCode: '',
      showSendFileModal: false,
      showRecvFileModal: false,
      fileList: [],
      uploadInfo: {
        targetId: '', // 对方的peerid
        message: '',
        files: [],
      },
    };

    this.onChangeFile = this.onChangeFile.bind(this);

    this.onChangeDownloadCode = e => this.setState({ downloadCode: e.target.value });
    this.onClickPrepareDownload = this.onClickPrepareDownload.bind(this);
    this.onHideRecvFileModal = () => this.props.history.push('/');
    this.handlePrepareDownloadRes = this.handlePrepareDownloadRes.bind(this);

    this.onShowSendFileModal = () => this.setState({ showSendFileModal: true });
    this.onHideSendFileModal = () => this.setState({ showSendFileModal: false, fileList: [] });
  }

  onChangeFile(e) {
    this.setState(produce(draft => {
      draft.fileList.push(e.file);
    }));
    this.onShowSendFileModal();
  }

  handlePrepareDownloadRes(msg) {
    const {
      type,
      payload,
    } = msg;
    if (type === 'S2C_PREPARE_DOWNLOAD') {
      this.setState(produce(draft => {
        draft.showRecvFileModal = true;
        draft.uploadInfo.targetId = payload.clientId;
        draft.uploadInfo.message = payload.message;
        draft.uploadInfo.files = payload.files;
      }));
      const ws = getWebSocket();
      ws.removeListener('message', this.handlePrepareDownloadRes);
    }
  }

  onClickPrepareDownload() {
    this.props.history.push(`/r/${this.state.downloadCode}`);
  }

  render() {
    return (
      <div className={styles.content}>
        <div className={styles.left}>
          <h1 className={styles.title}>
            我要收文件
          </h1>
          <Input placeholder="请输入取件码" className={styles.input} onChange={this.onChangeDownloadCode} />
          <Button type="primary" onClick={this.onClickPrepareDownload}>开始接收</Button>
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
        <Route path="/r/:downloadCode">
          <RecvFileModal
            isOpen={true}
            targetId={this.state.uploadInfo.targetId}
            message={this.state.uploadInfo.message}
            files={this.state.uploadInfo.files}
            onCancel={this.onHideRecvFileModal}
          />
        </Route>
      </div>
    );
  }
}

HomePage.defaultProps = {};

HomePage.propTypes = {
  prepareUpload: PropTypes.func,
  downloadCode: PropTypes.string,
  history: PropTypes.object,
};

function mapStateToProps(state) {
  return {
    downloadCode: state.file.downloadCode,
  };
}

export default withRouter(connect(mapStateToProps, {
  prepareUpload,
})(HomePage));
