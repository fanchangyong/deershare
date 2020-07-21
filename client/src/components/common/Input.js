import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Icon from './Icon';

import styles from './Input.cm.styl';

class Input extends Component {
  render() {
    const {
      error,
      containerClassName,
      inputClassName,
      type,
      value,
      readOnly,
      placeholder,
      autoComplete,
      autoFocus,
      autoCapitalize,
      onChange,
      onEnter = () => {},
      onBlur,
      onFocus,
      onClick,
      ...otherProps
    } = this.props;

    return (
      <div className={classNames(styles.container, containerClassName)}>
        <div className={styles.wrapper}>
          <input
            className={classNames(styles.input, inputClassName)}
            type={type || 'text'}
            value={value || ''}
            placeholder={placeholder}
            autoComplete={autoComplete}
            readOnly={readOnly}
            autoFocus={autoFocus}
            autoCapitalize={autoCapitalize}
            onChange={e => onChange(e.target.value)}
            onKeyDown={e => e.keyCode === 13 && onEnter()}
            onBlur={onBlur}
            onFocus={onFocus}
            onClick={onClick}
            {...otherProps}
          />
        </div>
        {!!error && (
          <div className={styles.error}>
            <Icon name="warning-circle" className={styles.errorIcon} />
            {error}
          </div>
        )}

      </div>
    );
  }
}

Input.propTypes = {
  label: PropTypes.string,
  error: PropTypes.string,
  containerClassName: PropTypes.string,
  inputClassName: PropTypes.string,
  required: PropTypes.bool,
  type: PropTypes.string,
  value: PropTypes.string,
  readOnly: PropTypes.bool,
  placeholder: PropTypes.string,
  isSimple: PropTypes.bool,
  autoComplete: PropTypes.string,
  autoFocus: PropTypes.bool,
  autoCapitalize: PropTypes.string,
  onChange: PropTypes.func,
  onEnter: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  onClick: PropTypes.func,
};

Input.defaultProps = {
  label: null,
  error: null,
};

export default Input;
