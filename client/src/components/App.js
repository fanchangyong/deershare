import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import * as Sentry from '@sentry/browser';

import HomePage from '../pages/HomePage';

import './App.css';
import './App.cm.styl';

class App extends React.Component {
  componentDidCatch(error, errorInfo) {
    if (process.env.NODE_ENV === 'production') {
      Sentry.withScope(scope => {
        Object.keys(errorInfo).forEach(key => {
          scope.setExtra(key, errorInfo[key]);
        });
        Sentry.captureException(error);
      });
    }
  }

  render() {
    return (
      <Router>
        <Switch>
          <Route path="/">
            <HomePage />
          </Route>
        </Switch>
      </Router>
    );
  }
}

App.propTypes = {
  sendHello: PropTypes.func,
  user: PropTypes.object,
};

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

export default connect(mapStateToProps, {
})(App);
