import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import classnames from 'classnames';
import uuidv4 from 'uuid/v4';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import PropTypes from 'prop-types';
import Icon from './Icon';
import styles from './Toast.cm.styl';

const TOAST_TYPES = {
  SUCCESS: 1,
  ERROR: 2,
  INFO: 3,
};

class Toast extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toasts: [],
    };
  }

  add(type, title) {
    const newId = uuidv4();
    const toast = {
      id: newId,
      type,
      title,
    };

    setTimeout(() => {
      this.setState(state => {
        const nextToasts = state.toasts.filter(t => t.id !== newId);
        return {
          toasts: nextToasts,
        };
      });
    }, 2000);

    this.setState(state => {
      return {
        toasts: [...state.toasts, toast],
      };
    });
  }

  render() {
    const {
      toasts = [],
    } = this.state;

    const iconNames = {
      [TOAST_TYPES.SUCCESS]: 'check',
      [TOAST_TYPES.ERROR]: 'close',
      [TOAST_TYPES.INFO]: 'info',
    };

    const classNamesOfToastType = {
      [TOAST_TYPES.SUCCESS]: styles.success,
      [TOAST_TYPES.ERROR]: styles.error,
      [TOAST_TYPES.INFO]: styles.info,
    };

    return (
      <div className={styles.container}>
        <TransitionGroup component={null}>
          {toasts.map(t => {
            const toastType = t.type;
            return (
              <CSSTransition
                key={t.id}
                classNames="toast-animation"
                timeout={220}
              >
                <div className={classnames(styles.toast, classNamesOfToastType[toastType])}>
                  <div className={classnames(styles.iconWrapper, classNamesOfToastType[toastType])}>
                    <Icon name={iconNames[toastType]} />
                  </div>
                  <div key={t.id} className={classnames(styles.content, classNamesOfToastType[toastType])}>
                    {t.title}
                  </div>
                </div>
              </CSSTransition>
            );
          })}
        </TransitionGroup>
      </div>
    );
  }
}

const div = document.createElement('div');
document.body.appendChild(div);
const toastInstance = React.createRef();
ReactDOM.render(<Toast ref={toastInstance} />, div);

Toast.success = (title) => {
  toastInstance.current.add(TOAST_TYPES.SUCCESS, title);
};

Toast.error = (title) => {
  toastInstance.current.add(TOAST_TYPES.ERROR, title);
};

Toast.info = (title) => {
  toastInstance.current.add(TOAST_TYPES.INFO, title);
};

Toast.propTypes = {
  toasts: PropTypes.array,
};

export default Toast;
