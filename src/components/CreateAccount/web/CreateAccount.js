import React from 'react';
import './CreateAccount.styl';
import PropTypes from 'prop-types';

/**
 * Web mask that will be shown to users who want to create a new account.
 */
export default class CreateAccount extends React.Component {
  /**
   * Instantiates a new create account form.
   */
  constructor() {
    super();
    this.state = {
      username: '',
      mail: '',
      password: '',
      repeatPassword: '',
    };
  }

  /**
   * @override
   */
  render() {
    const navigateBack = (event) => {
      this.props.goBack();
    };

    const createAccount = (event) => {
      this.props.createAccount(
        this.state.username,
        this.state.mail,
        this.state.password,
        this.state.repeatPassword
      );
    };

    return (
      <div className="dashboard">
        <div className="dashboard__back-button" onClick={navigateBack}>Zurück</div>
        <div className="dashboard__fields">
          <div className="dashboard__field">
            <div className="dashboard__field-text">Username:</div>
            <input
              ref="username"
              type="text"
              value={this.state.username}
              onChange={(username) => this.setState({username})}
            />
          </div>
          <div className="dashboard__field">
            <div className="dashboard__field-text">Email:</div>
            <input
              ref="email"
              type="text"
              value={this.state.mail}
              onChange={(mail) => this.setState({mail})}
            />
          </div>
          <div className="dashboard__field">
            <div className="dashboard__field-text">Password:</div>
            <input
              ref="password"
              type="password"
              value={this.state.password}
              onChange={(password) => this.setState({password})}
            />
          </div>
          <div className="dashboard__field">
            <div className="dashboard__field-text">Repeat Password:</div>
            <input
              ref="repeatPassword"
              type="password"
              value={this.state.repeatPassword}
              onChange={(repeatPassword) => this.setState({repeatPassword})}
            />
          </div>
        </div>
        <input type="button" value="Create Account" onClick={createAccount} />
      </div>
    );
  }
}

CreateAccount.propTypes = {
  checkUsername: PropTypes.func,
  usernameValid: PropTypes.bool,
  createAccount: PropTypes.func,
  isLoading: PropTypes.bool,
  goBack: PropTypes.func,
};
