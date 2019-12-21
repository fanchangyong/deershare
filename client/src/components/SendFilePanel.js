import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CopyToClipboard from 'react-copy-to-clipboard';
import uuidv4 from 'uuid/v4';
import {
  Link,
} from 'react-router-dom';
import Icon from './common/Icon';
import Button from './common/Button';
import Steps from './common/Steps';
import Toast from './common/Toast';

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
    this.onClickBack = this.onClickBack.bind(this);
  }

  onClickUpload() {
    this.inputRef.current.click();
  }

  onClickSelectDone() {
    this.setState({
      curStep: 2,
    });
  }

  onClickBack() {
    this.setState(state => {
      return {
        curStep: state.curStep - 1,
      };
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

  renderStep2() {
    return (
      <>
        <div className={styles.selectSendMethod}>
          请选择发送方式：
        </div>
        <div className={styles.sendMethod1}>
          1. 通过链接发送（对方打开链接即可下载文件）
        </div>
        <div className={styles.downloadLinkContainer}>
          <span className={styles.downloadLink}>
            https://deershare.com/s/786699
          </span>
          <CopyToClipboard text="https://deershare.com/s/786699" onCopy={() => Toast.success('复制成功')}>
            <span className={styles.btnCopy}>
              复制
            </span>
          </CopyToClipboard>
        </div>
        <div>
          2. 通过6位数取件码（对方在小鹿快传网站输入即可下载文件）
        </div>
        <div className={styles.downloadCodeContainer}>
          <span className={styles.downloadCode}>
            786699
          </span>
          <CopyToClipboard text="786699" onCopy={() => Toast.success('复制成功')}>
            <span className={styles.btnCopy}>
              复制
            </span>
          </CopyToClipboard>
        </div>
        <div>
          3. 扫描下方二维码：
        </div>
        <div className={styles.qrcodeContainer}>
          <img src="/images/qrcode_wechat.jpg" alt="qrcode" className={styles.recvQrcode}/>
        </div>

        <div className={styles.connectTips}>
          温馨提示：<br />
          以上取件码在10分钟内有效，请尽快发送给对方 <br />
          对方输入取件码并确认之后会自动开始发送
        </div>
        <Button type="primary" className={styles.btnWaitConnect} disabled>
          等待连接...
        </Button>
      </>
    );
  }

  renderStep3() {
    const {
      fileList,
    } = this.state;

    let totalSize = '0MB';

    return (
      <>
        <div className={styles.sendingBox}>
          {fileList.map(f => {
            return (
              <div key={f.uid} className={styles.sendingFileRow}>
                <Icon name="file" className={styles.fileIcon} />
                <div className={styles.fileInfo}>
                  <div className={styles.fileName}>
                    {f.name}
                  </div>
                  <div className={styles.fileSize}>
                    {f.size}
                  </div>
                </div>
                <div className={styles.sendPct}>80%</div>
              </div>
            );
          })}
        </div>
        <div className={styles.sendingSummary}>
          正在发送{fileList.length}个文件，共{totalSize}
        </div>
        <Button type="primary" className={styles.btnSending} disabled>
          正在发送...（3.5MB/s）
        </Button>
      </>
    );
  }

  render() {
    const {
      curStep,
    } = this.state;

    return (
      <div className={styles.base}>
        <div className={styles.titleRow}>
          {curStep === 2 && (
            <div className={styles.back} onClick={this.onClickBack}>
              返回
            </div>
          )}
          <div className={styles.title}>
            发送文件
          </div>
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
        {curStep === 2 && this.renderStep2()}
        {curStep === 3 && this.renderStep3()}
        <input type="file" hidden ref={this.inputRef} onChange={this.onChangeFile} multiple />
      </div>
    );
  }
}

export default SendFilePanel;
