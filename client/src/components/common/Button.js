import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import classNamesBind from 'classnames/bind';
import Icon from './Icon';
import styles from './Button.cm.styl';

const cx = classNamesBind.bind(styles);

class Button extends Component {
  render() {
    const {
      type,
      style,
      disabled,
      loading,
      children,
      href,
      onClick,
    } = this.props;

    const className = classNames(cx(
      `btn-${type}`,
      { 'btn-disabled': disabled },
      { 'btn-loading': loading },
    ),
    this.props.className);

    if (href) {
      return (
        <Link
          to={href}
          style={style}
          className={className}
        >
          {children}
        </Link>
      );
    }

    return (
      <button
        type="button"
        style={style}
        className={className}
        onClick={onClick}
        disabled={disabled || loading}
      >
        {loading && <Icon name="loading" animation='spin' className={styles.loadingIcon} />}
        {children}
      </button>
    );
  }
}

Button.propTypes = {
  type: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  style: PropTypes.shape({}),
  className: PropTypes.string,
  onClick: PropTypes.func,
  children: PropTypes.node,
  href: PropTypes.string,
};

Button.defaultProps = {
  disabled: false,
  style: null,
  className: null,
  onClick: null,
  children: null,
  href: null,
};

export default Button;
