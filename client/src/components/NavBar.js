import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import {
  withRouter,
} from 'react-router';

import {
  Link,
} from 'react-router-dom';

import styles from './NavBar.cm.styl';

function NavBar(props) {
  const pathname = props.location.pathname;

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
            className={classnames(styles.menu, pathname === '/recv' && styles.active)}
          >
            接收文件
          </span>
        </Link>
        <Link to="/contact">
          <span className={classnames(styles.menu, pathname === '/contact' && styles.active)}>
           联系我们
          </span>
        </Link>
      </div>
    </div>
  );
}

NavBar.defaultProps = {};

NavBar.propTypes = {
  location: PropTypes.object,
};

export default withRouter(NavBar);
