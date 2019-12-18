import React from 'react';
import PropTypes from 'prop-types';
import styles from './SloganCard.cm.styl';

function SloganCard({ title, desc, icon }) {
  return (
    <div className={styles.card}>
      <div className={styles.title}>
        {icon}
        {title}
      </div>
      <div className={styles.desc}>
        {desc}
      </div>
    </div>
  );
}

SloganCard.defaultProps = {};

SloganCard.propTypes = {
  title: PropTypes.string,
  desc: PropTypes.string,
  icon: PropTypes.element,
};

export default SloganCard;
