import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './Icon.cm.styl';

class Icon extends Component {
  render() {
    const {
      className,
      name,
      spin,
      tooltip,
      onClick,
    } = this.props;

    const icon = (
      <i
        className={classNames('iconfont', `icon-${name}`, styles.icon, spin && styles.spin, className)}
        onClick={onClick}
      />
    );

    if (tooltip) {
      return (
        <span className={classNames('tooltip--top')} aria-label={tooltip}>
          {icon}
        </span>
      );
    }

    return (
      icon
    );
  }
}

Icon.propTypes = {
  className: PropTypes.string,
  name: PropTypes.string,
  tooltip: PropTypes.string,
  spin: PropTypes.bool,
  onClick: PropTypes.func,
};

Icon.defaultProps = {
  className: null,
  name: null,
  onClick: null,
};

export default Icon;
