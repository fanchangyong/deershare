import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { sendHello } from '../actions/user';

class App extends React.Component {
  constructor () {
    super();
    this.onClickBtn = this.onClickBtn.bind(this);
  }

  onClickBtn () {
    this.props.sendHello('hello server');
  }

  render () {
    return (
      <div>
        <h1 style={{ textAlign: 'center' }}>
          Hello React
        </h1>
        <button onClick={this.onClickBtn}>
          Hello Server
        </button>
        <div style={{ background: 'green' }}>{this.props.user.msg}</div>
      </div>
    );
  }
}

App.propTypes = {
  sendHello: PropTypes.func,
  user: PropTypes.object,
};

function mapStateToProps (state) {
  return {
    user: state.user,
  };
}

export default connect(mapStateToProps, {
  sendHello,
})(App);
