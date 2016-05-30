import React from 'react';

export default class Login extends React.Component {
  render() {
      
    const onLogin = e => {
        e.preventDefault();
        this.props.finalizeLogin(this.refs.playerName.value, this.refs.password.value);
        //hashHistory.push('dashboard.html');
    };
      
    return <div>
        <form onSubmit={onLogin}>
            <input ref="playerName" type="text" name="name" />
            <input ref="password" type="password" name="name" />
            <input type="submit" />
        </form>
    </div>;
  }
};