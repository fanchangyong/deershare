import React from 'react';
import styles from './Footer.cm.styl';

function Footer() {
  return (
    <div className={styles.base}>
      <span>
        © 2020 小鹿快传 | <a target="_blank" rel="noopener noreferrer" href="http://beian.miit.gov.cn/">鲁ICP备18047579号-2</a> | 友情链接：
      </span>
      <a target="_blank" rel="noopener noreferrer" href="https://wonderfulcv.com">橙子简历</a>
      <a target="_blank" rel="noopener noreferrer" href="https://github.com/fanchangyong/deershare"> | GitHub</a>
      <a target="_blank" rel="noopener noreferrer" href="mailto:support@deershare.com"> | 联系我们 </a>
    </div>
  );
}

Footer.defaultProps = {};

Footer.propTypes = {
};

export default Footer;
