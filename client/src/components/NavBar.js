import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import {
  withRouter,
  matchPath,
} from 'react-router';

import {
  Link,
} from 'react-router-dom';

import styles from './NavBar.cm.styl';

function NavBar(props) {
  const pathname = props.location.pathname;

  const matchRecv = matchPath(pathname, '/recv/:recvCode?');

  return (
    <div className={styles.base}>
      <a href="/">
        <img src="/images/logo.png" alt="logo" className={styles.logo} />
      </a>
      <div className={styles.slogan}>
        简单安全高效的P2P文件传输服务
      </div>
      <div className={styles.menus}>
        <Link to="/send">
          <span
            className={classnames(styles.menu, pathname === '/send' && styles.active)}
          >
            发送文件
          </span>
        </Link>
        <Link to="/recv">
          <span
            className={classnames(styles.menu, matchRecv && styles.active)}
          >
            接收文件
          </span>
        </Link>
        <a href="https://wonderfulcv.com" target="_blank" className={styles.ad}>
          橙子简历（友情链接）
          <div className={styles.adQrcode}>
            <div className={styles.cvDesc}>
              微信扫码立即制作简历
            </div>
            <img src="/images/qrcode_wechat.jpg" />
          </div>
        </a>

      </div>
      <a class="github-button" href="https://github.com/fanchangyong/deershare" data-size="large" data-show-count="true" aria-label="Star fanchangyong/deershare on GitHub">Star</a>
    </div>
  );
}

NavBar.defaultProps = {};

NavBar.propTypes = {
  location: PropTypes.object,
};

export default withRouter(NavBar);
