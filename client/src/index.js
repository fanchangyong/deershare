import 'normalize.css';
import React from 'react';
import ReactDOM from 'react-dom';
import 'webrtc-adapter';
import { Provider } from 'react-redux';
import ReactGA from 'react-ga';
import {
  BrowserRouter as Router,
} from 'react-router-dom';
import App from './components/App';
import configureStore from './store/configureStore';
import configureWS from './actions/configureWS';

import './common/global.css';

const store = configureStore();

configureWS(store.dispatch);

// Initialize Google Analytics
if (process.env.NODE_ENV === 'production') {
  ReactGA.initialize('UA-131382726-2');
  ReactGA.pageview(window.location.pathname + window.location.search);
}

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
