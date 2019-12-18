import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class Icon extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      className,
      name,
      tooltip,
      onClick,
    } = this.props;

    const icon = (
      <i
        className={classNames('iconfont', `icon-${name}`, className)}
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
  onClick: PropTypes.func,
};

Icon.defaultProps = {
  className: null,
  name: null,
  onClick: null,
};

export default Icon;
