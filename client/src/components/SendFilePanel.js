import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Link,
} from 'react-router-dom';
import Icon from './common/Icon';
import Button from './common/Button';

import styles from './SendFilePanel.cm.styl';

class SendFilePanel extends Component {
  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
    this.onClickUpload = this.onClickUpload.bind(this);
  }

  onClickUpload() {
    this.inputRef.current.click();
  }

  render() {
    return (
      <div className={styles.base}>
        <div className={styles.title}>
          发送文件
        </div>
        <div className={styles.uploadArea}>
          <div>
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
        <input type="file" hidden ref={this.inputRef} />
      </div>
    );
  }
}

export default SendFilePanel;
