import React from 'react';
import { Input, Button, Upload } from 'antd';
import SendFileModal from '../components/SendFileModal';

import styles from './HomePage.cm.styl';

class HomePage extends React.Component {
  constructor() {
    super();
    this.state = {
      showSendFileModal: false,
    };

    this.onShowSendFileModal = () => this.setState({ showSendFileModal: true });
    this.onHideSendFileModal = () => this.setState({ showSendFileModal: false });
  }

  render () {
    return (
      <div className={styles.content}>
        <div className={styles.left}>
          <h1 className={styles.title}>
            我要收文件
          </h1>
          <Input placeholder="请输入取件码" className={styles.input} />
          <Button type="primary">开始接收</Button>
        </div>
        <div className={styles.right}>
          <h1 className={styles.title}>
            我要发文件
          </h1>
          <Button type="primary" onClick={this.onShowSendFileModal} >添加文件</Button>
        </div>
        <SendFileModal
          isOpen={this.state.showSendFileModal}
          onCancel={this.onHideSendFileModal}
        />
      </div>
    );
  }
}

HomePage.defaultProps = {};

HomePage.propTypes = {
};

export default HomePage;
