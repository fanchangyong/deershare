import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styles from './Steps.cm.styl';

class Steps extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    // const {
    //   steps,
    // } = this.pros;

    return (
      <div className={styles.steps}>
        {this.props.children}
      </div>
    );
  }
}

class Step extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      title,
      index,
      active,
    } = this.props;

    return (
      <span className={classnames(styles.step, active && styles.active)}>
        <span className={classnames(styles.indexWrapper, active && styles.active)}>
          <span className={styles.index}>
            {index}
          </span>
        </span>
        <span className={styles.title}>
          {title}
        </span>
      </span>
    );
  }
}

Steps.Step = Step;

export default Steps;
