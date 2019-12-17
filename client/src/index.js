import React from 'react';
import ReactDOM from 'react-dom';
import 'webrtc-adapter';
import { Provider } from 'react-redux';
import App from './components/App';
import configureStore from './store/configureStore';
import configureWS from './actions/configureWS';

const store = configureStore();

configureWS(store.dispatch);

ReactDOM.render(
  <Provider
    store={store}
  >
    <App />
  </Provider>,
  document.getElementById('root'),
);
