import React, { Component } from 'react';
import PropTypes from 'prop-types';
import uuidv4 from 'uuid/v4';
import {
  Link,
} from 'react-router-dom';
import Icon from './common/Icon';
import Button from './common/Button';
import Steps from './common/Steps';

import styles from './SendFilePanel.cm.styl';

const Step = Steps.Step;

class SendFilePanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      curStep: 1,
      fileList: [],
    };
    this.inputRef = React.createRef();
    this.onClickUpload = this.onClickUpload.bind(this);
    this.onChangeFile = this.onChangeFile.bind(this);
    this.onRemoveFile = this.onRemoveFile.bind(this);
    this.onClickSelectDone = this.onClickSelectDone.bind(this);
  }

  onClickUpload() {
    this.inputRef.current.click();
  }

  onClickSelectDone() {
    this.setState({
      curStep: 2,
    });
  }

  onChangeFile(event) {
    const files = Array.from(event.target.files);
    files.forEach(f => {
      f.uid = uuidv4();
    });

    this.setState(state => {
      return {
        fileList: state.fileList.concat(files),
      };
    });
  }

  onRemoveFile(uid) {
    return () => {
      this.setState(state => {
        return {
          fileList: state.fileList.filter(f => f.uid !== uid),
        };
      });
    };
  }

  renderStep1() {
    const {
      fileList,
    } = this.state;

    let totalSize = '1024MB';

    if (fileList.length === 0) {
      return (
        <>
          <div className={styles.uploadArea}>
            <div className={styles.iconPlusWrapper}>
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
        </>
      );
    } else {
      return (
        <>
          <div className={styles.uploadArea}>
            {fileList.map(f => {
              return (
                <div key={f.uid} className={styles.fileRow}>
                  <Icon name="file" className={styles.fileIcon} />
                  <div className={styles.fileInfo}>
                    <div className={styles.fileName}>
                      {f.name}
                    </div>
                    <div className={styles.fileSize}>
                      {f.size}
                    </div>
                  </div>
                  <Icon name="close" onClick={this.onRemoveFile(f.uid)} className={styles.closeIcon} />
                </div>
              );
            })}
          </div>
          <div className={styles.uploadMore}>
            <div className={styles.addMore} onClick={this.onClickUpload}>
              <span>添加文件</span>
            </div>
            <div className={styles.fileSummary}>{fileList.length}个文件，共{totalSize}</div>
          </div>
          <Button type="primary" className={styles.btnSelectFileDone} onClick={this.onClickSelectDone}>
            选好了
          </Button>
        </>
      );
    }
  }

  render() {
    const {
      curStep,
    } = this.state;

    return (
      <div className={styles.base}>
        <div className={styles.title}>
          发送文件
        </div>
        <Steps>
          <Step
            index={1}
            title="选择文件"
            active={curStep === 1}
          />
          <Step index={2} title="收件码" active={curStep === 2} />
          <Step index={3} title="发送" active={curStep === 3} />
        </Steps>
        {curStep === 1 && this.renderStep1()}
        <input type="file" hidden ref={this.inputRef} onChange={this.onChangeFile} multiple />
      </div>
    );
  }
}

export default SendFilePanel;
