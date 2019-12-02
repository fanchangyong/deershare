import React from 'react';
import { Input, Button, Upload } from 'antd';
import styles from './HomePage.cm.styl';

function HomePage({  }) {
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
        <Upload>
          <Button type="primary">添加文件</Button>
        </Upload>
      </div>
    </div>
  );
}

HomePage.defaultProps = {};

HomePage.propTypes = {
};

export default HomePage;
