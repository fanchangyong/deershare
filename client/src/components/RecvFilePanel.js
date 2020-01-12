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
      curStep: 1,
      recvCode: '',
    };
    this.onChangeRecvCode = this.onChangeRecvCode.bind(this);
    this.onPrepareRecv = this.onPrepareRecv.bind(this);
  }

  onChangeRecvCode(value) {
    this.setState({ recvCode: value });
  }

  onPrepareRecv() {
    this.props.prepareRecv(this.state.recvCode);
  }

  renderStep1() {
    const {
      recvCode,
    } = this.state;

    return (
      <>
        <div className={styles.title}>
          接收文件
        </div>
        <Input placeholder="请输入6位收件码" inputClassName={styles.input} value={recvCode} onChange={this.onChangeRecvCode} />
        <Button type="primary" className={styles.recvBtn} onClick={this.onPrepareRecv}>接收文件</Button>
        <div className={styles.tip}>
          <Icon name="info" />
          如何获取收件码？
        </div>
      </>
    );
  }

  renderStep2() {

  }

  render() {
    const {
      curStep,
    } = this.state;

    return (
      <div className={styles.base}>
        {curStep === 1 && this.renderStep1()}
      </div>
    );
  }
}

RecvFilePanel.propTypes = {
  prepareRecv: PropTypes.func,
};

export default RecvFilePanel;
