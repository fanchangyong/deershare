import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import {
  Route,
} from 'react-router-dom';
import produce from 'immer';
import { Input, Button, Upload } from 'antd';
import PropTypes from 'prop-types';
import NavBar from '../components/NavBar';
import { prepareUpload } from '../actions/file';
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
    };

    this.onChangeFile = this.onChangeFile.bind(this);

    this.onChangeDownloadCode = e => this.setState({ downloadCode: e.target.value });
    this.onClickPrepareDownload = this.onClickPrepareDownload.bind(this);
    this.onHideRecvFileModal = () => this.props.history.push('/');

    this.onShowSendFileModal = () => this.setState({ showSendFileModal: true });
    this.onHideSendFileModal = () => this.setState({ showSendFileModal: false, fileList: [] });
  }

  onChangeFile(e) {
    this.setState(produce(draft => {
      draft.fileList.push(e.file);
    }));
    this.onShowSendFileModal();
  }

  onClickPrepareDownload() {
    this.props.history.push(`/r/${this.state.downloadCode}`);
  }

  render() {
    return (
      <div className={styles.content}>
        <NavBar />
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
