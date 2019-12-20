import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import uuidv4 from 'uuid/v4';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
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
    }, 1000);

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
      <ReactCSSTransitionGroup transitionName="toast-animation" transitionEnterTimeout={500} transitionLeaveTimeout={300}>
        {toasts.map(t => {
          return (
            <div key={t.id} className={styles.toast}>
              {t.title}
            </div>
          );
        })}
      </ReactCSSTransitionGroup>
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
