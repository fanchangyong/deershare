import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import uuidv4 from 'uuid/v4';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import PropTypes from 'prop-types';
import styles from './Toast.cm.styl';

const TOAST_TYPES = {
  SUCCESS: 1,
  ERROR: 2,
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

    return (
      <div className={styles.container}>
        <TransitionGroup component={null}>
          {toasts.map(t => {
            return (
              <CSSTransition
                key={t.id}
                classNames="toast-animation"
                timeout={220}
              >
                <div key={t.id} className={styles.toast}>
                  {t.title}
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

Toast.propTypes = {
  toasts: PropTypes.array,
};

export default Toast;
