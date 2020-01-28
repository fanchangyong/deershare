import 'normalize.css';
import React from 'react';
import ReactDOM from 'react-dom';
import 'webrtc-adapter';
import { Provider } from 'react-redux';
import * as Sentry from '@sentry/browser';
import ReactGA from 'react-ga';
import {
  BrowserRouter as Router,
} from 'react-router-dom';
import App from './components/App';
import configureStore from './store/configureStore';
import configureWS from './actions/configureWS';

const store = configureStore();

configureWS(store.dispatch);

// Configure Sentry
Sentry.init({ dsn: 'https://be8db30a0db043f686f64c4fc91682c8@sentry.io/2034634', environment: process.env.NODE_ENV });

// Initialize Google Analytics
ReactGA.initialize('UA-131382726-2');
ReactGA.pageview(window.location.pathname + window.location.search);

ReactDOM.render(
  <Provider
    store={store}
  >
    <Router>
      <App />
    </Router>
  </Provider>,
  document.getElementById('root'),
);
