import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './CommonPanel.cm.styl';

class CommonPanel extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      title,
    } = this.props;

    return (
      <div className={styles.base}>
        <div className={styles.title}>
          {title}
        </div>
      </div>
    );
  }
}

export default CommonPanel;
