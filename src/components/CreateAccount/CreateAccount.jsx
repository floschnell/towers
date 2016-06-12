import React from 'react';
import { hashHistory } from 'react-router';

export default class CreateAccount extends React.Component {
  
  componentWillMount() {
  }
  
  render() {
    
    const navigateBack = event => {
        hashHistory.push('/');
    };
    
    const createAccount = event => {
        this.props.createAccount(this.refs.username.value, this.refs.email.value, this.refs.password.value, this.refs.repeatPassword.value);
    };
    
    return <div class="dashboard">
        <div class="dashboard__back-button" onClick={navigateBack}>Zurück</div>
        <div>Username: <input ref="username" type="text" value={this.props.userName} /></div>
        <div>Email: <input ref="email" type="text" value={this.props.mail} /></div>
        <div>Password: <input ref="password" type="password" /></div>
        <div>Repeat Password: <input ref="repeatPassword" type="password" /></div>
        <input type="button" value="Create Account" onClick={createAccount} />
      </div>;
  }
}