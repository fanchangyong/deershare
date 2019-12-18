import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Link,
} from 'react-router-dom';
import Icon from './common/Icon';
import Button from './common/Button';
import Input from './common/Input';

import styles from './ContactPanel.cm.styl';

class ContactPanel extends Component {
  render() {
    return (
      <div className={styles.base}>
        <div className={styles.title}>
          联系我们
        </div>
        <div>
          <img src="/images/qrcode_wechat.jpg" alt="qrcode-wechat" />
        </div>
        <div className={styles.tip}>
          请扫描上方二维码关注公众号，并给我们留言
        </div>
      </div>
    );
  }
}

export default ContactPanel;
