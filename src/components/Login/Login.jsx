import React from 'react';
import { hashHistory } from 'react-router';

export default class Login extends React.Component {
  render() {
      
    const onLogin = e => {
        this.props.finalizeLogin(this.refs.playerName.value, this.refs.password.value);
    };
    
    const onCreateAccount = e => {
        hashHistory.push('createAccount.html');
    };
      
    return <div>
        <input ref="playerName" type="text" name="name" />
        <input ref="password" type="password" name="name" />
        <input type="button" value="Login" onClick={onLogin} />
        <input type="button" value="Create Account" onClick={onCreateAccount} />
    </div>;
  }
};