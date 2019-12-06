import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button } from 'antd';
import {
  formatBytes,
} from '../common/util';

import styles from './RecvFileModal.cm.styl';

class DownloadFileModal extends Component {
  render() {
    const {
      isOpen,
      message,
      files,
    } = this.props;

    // const isOpen = true;
    // const message = 'test message';
    // const files = [
    //   {
    //     uid: '1',
    //     name: 'file1.txt',
    //     size: 102400,
    //   },
    //   {
    //     uid: '2',
    //     name: 'file2.txt',
    //     size: 102400,
    //   },
    // ];

    if (!isOpen) {
      return null;
    }

    const totalBytes = files.reduce((sum, cur) => {
      return sum + cur.size;
    }, 0);

    return (
      <div className={styles.base}>
        <Modal
          title="接收文件"
          footer={null}
          visible={isOpen}
          onCancel={this.props.onCancel}
        >
          <h4>对方发送给您以下文件及信息：</h4>
          {!!message && (
            <div className={styles.message}>{message}</div>
          )}
          <div className={styles.fileBox}>
            {files.map(f => (
              <div key={f.uid} className={styles.file}>
                <span className={styles.fileName}>
                  {f.name}
                </span>
                <span>{formatBytes(f.size)}</span>
              </div>
            ))}
          </div>
          <div className={styles.summary}>
            {files.length} 个文件，共 {formatBytes(totalBytes)}
          </div>
          <Button type="primary" block size="large">
            开始下载
          </Button>
        </Modal>
      </div>
    );
  }
}

DownloadFileModal.propTypes = {
  isOpen: PropTypes.bool,
  message: PropTypes.string,
  files: PropTypes.array,
  onCancel: PropTypes.func,
};

export default DownloadFileModal;
