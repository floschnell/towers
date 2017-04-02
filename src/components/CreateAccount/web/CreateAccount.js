import React from 'react';
import { hashHistory } from 'react-router';
import css from './CreateAccount.styl';

export default class CreateAccount extends React.Component {
  
  componentWillMount() {
  }
  
  render() {
    
    const navigateBack = event => {
        this.props.goBack();
    };
    
    const createAccount = event => {
        this.props.createAccount(this.refs.username.value, this.refs.email.value, this.refs.password.value, this.refs.repeatPassword.value);
    };
    
    return <div className="dashboard">
        <div className="dashboard__back-button" onClick={navigateBack}>Zurück</div>
        <div className="dashboard__fields">
            <div className="dashboard__field">
                <div className='dashboard__field-text'>Username:</div><input ref="username" type="text" value={this.props.userName} />
            </div>
            <div className="dashboard__field">
                <div className='dashboard__field-text'>Email:</div><input ref="email" type="text" value={this.props.mail} />
            </div>
            <div className="dashboard__field">
                <div className='dashboard__field-text'>Password:</div><input ref="password" type="password" />
            </div>
            <div className="dashboard__field">
                <div className='dashboard__field-text'>Repeat Password:</div><input ref="repeatPassword" type="password" />
            </div>
        </div>
        <input type="button" value="Create Account" onClick={createAccount} />
      </div>;
  }
}