import 'normalize.css';
import React from 'react';
import ReactDOM from 'react-dom';
import 'webrtc-adapter';
import { Provider } from 'react-redux';
import * as Sentry from '@sentry/browser';
import App from './components/App';
import configureStore from './store/configureStore';
import configureWS from './actions/configureWS';

const store = configureStore();

configureWS(store.dispatch);

// Configure Sentry
Sentry.init({ dsn: 'https://be8db30a0db043f686f64c4fc91682c8@sentry.io/2034634', environment: process.env.NODE_ENV });

ReactDOM.render(
  <Provider
    store={store}
  >
    <App />
  </Provider>,
  document.getElementById('root'),
);
