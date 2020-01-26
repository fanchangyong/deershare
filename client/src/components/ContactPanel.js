import React, { Component } from 'react';
import axios from 'axios';
import Input from './common/Input';
import Button from './common/Button';
import Toast from './common/Toast';

import styles from './ContactPanel.cm.styl';

class ContactPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contact: '',
      content: '',
    };

    this.handleContactChange = this.handleContactChange.bind(this);
    this.handleContentChange = this.handleContentChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleContactChange(value) {
    this.setState({
      contact: value,
    });
  }

  handleContentChange(e) {
    this.setState({
      content: e.target.value,
    });
  }

  handleSubmit() {
    const {
      contact,
      content,
    } = this.state;

    if (!contact) {
      Toast.error('请输入联系方式');
      return;
    }

    if (!content) {
      Toast.error('请输入留言内容');
      return;
    }

    axios.post('/api/feedback', {
      contact,
      content,
    })
    .then((res) => {
      Toast.success('留言成功');
      this.setState({
        contact: '',
        content: '',
      });
    });
  }

  render() {
    const {
      contact,
      content,
    } = this.state;

    return (
      <div className={styles.base}>
        <div className={styles.title}>
          联系我们
        </div>
        <Input placeholder="请输入您的手机号或邮箱" inputClassName={styles.input} value={contact} onChange={this.handleContactChange} />
        <textarea placeholder="请输入留言内容" rows="6" className={styles.textarea} value={content} onChange={this.handleContentChange} />
        <Button type="primary" className={styles.btn} onClick={this.handleSubmit}>
          留言
        </Button>
        <div className={styles.tips}>
          请直接在上方留言，我们会尽快给您回复，<br />
          您也可以发邮件到 <a target="_blank" rel="noopener noreferrer" href="mailto:support@deershare.com">support@deershare.com</a>
        </div>
      </div>
    );
  }
}

export default ContactPanel;
