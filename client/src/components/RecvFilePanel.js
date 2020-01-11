import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icon from './common/Icon';
import Button from './common/Button';
import Input from './common/Input';

import styles from './RecvFilePanel.cm.styl';

class RecvFilePanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      downloadCode: '',
    };
    this.onChangeDownloadCode = this.onChangeDownloadCode.bind(this);
    this.onPrepareDownload = this.onPrepareDownload.bind(this);
  }

  onChangeDownloadCode(value) {
    this.setState({ downloadCode: value });
  }

  onPrepareDownload() {
    this.props.prepareDownload(this.state.downloadCode);
  }

  render() {
    const {
      downloadCode,
    } = this.state;

    return (
      <div className={styles.base}>
        <div className={styles.title}>
          接收文件
        </div>
        <Input placeholder="请输入6位收件码" inputClassName={styles.input} value={downloadCode} onChange={this.onChangeDownloadCode} />
        <Button type="primary" className={styles.recvBtn} onClick={this.onPrepareDownload}>接收文件</Button>
        <div className={styles.tip}>
          <Icon name="info" />
          如何获取收件码？
        </div>
      </div>
    );
  }
}

RecvFilePanel.propTypes = {
  prepareDownload: PropTypes.func,
};

export default RecvFilePanel;
