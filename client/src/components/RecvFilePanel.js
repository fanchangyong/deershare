import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icon from './common/Icon';
import Button from './common/Button';
import Input from './common/Input';

import styles from './RecvFilePanel.cm.styl';

class RecvFilePanel extends Component {
  render() {
    return (
      <div className={styles.base}>
        <div className={styles.title}>
          接收文件
        </div>
        <Input placeholder="请输入6位收件码" inputClassName={styles.input} />
        <Button type="primary" className={styles.recvBtn}>接收文件</Button>
        <div className={styles.tip}>
          <Icon name="info" />
          如何获取收件码？
        </div>
      </div>
    );
  }
}

export default RecvFilePanel;
