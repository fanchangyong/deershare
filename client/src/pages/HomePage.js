import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import {
  Switch,
  Redirect,
  Route,
} from 'react-router-dom';
import produce from 'immer';
import PropTypes from 'prop-types';
import NavBar from '../components/NavBar';
import SendFilePanel from '../components/SendFilePanel';
import { prepareUpload } from '../actions/file';

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
      <div className={styles.container}>
        <NavBar />
        <Route exact path="/">
          <Redirect to="/send" />
        </Route>
        <div className={styles.content}>
          <SendFilePanel />
        </div>
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
