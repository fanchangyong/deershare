import React from 'react';
import styles from './Footer.cm.styl';

function Footer() {
  return (
    <div className={styles.base}>
      <span>
        Copyright© 2019 小鹿快传 | 友情链接：
      </span>
      <a target="_blank" rel="noopener noreferrer" href="https://wonderfulcv.com">橙子简历</a>
      <a target="_blank" rel="noopener noreferrer" href="mailto:support@deershare.com"> | 联系我们 </a>
    </div>
  );
}

Footer.defaultProps = {};

Footer.propTypes = {
};

export default Footer;
