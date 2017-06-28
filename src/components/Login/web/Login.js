import React from 'react';
import {AUTH_STATE} from '../../../actions/app';
import './Login.styl';
import PropTypes from 'prop-types';

/**
 * The login form for the web.
 */
export default class Login extends React.Component {
  /**
   * @override
   */
  render() {
    const onLogin = e => {
      this.props.finalizeLogin(this.refs.email.value, this.refs.password.value);
    };

    const onCreateAccount = () => {
      this.props.createAccount();
    };

    if (
      this.props.authState === AUTH_STATE.INITIALIZING ||
      this.props.authState === AUTH_STATE.PENDING
    ) {
      return <div>logging you in ...</div>;
    }

    return (
      <div>
        <input ref="email" type="text" name="email" />
        <input ref="password" type="password" name="password" />
        <input type="button" value="Login" onClick={onLogin} />
        <input type="button" value="Create Account" onClick={onCreateAccount} />
      </div>
    );
  }
}

Login.propTypes = {
  authState: PropTypes.string,
  createAccount: PropTypes.func,
  finalizeLogin: PropTypes.func,
};
