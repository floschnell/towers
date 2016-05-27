import React from 'react';
import { hashHistory } from 'react-router'

export default class Login extends React.Component {
  render() {
      
    const onLogin = e => {
        e.preventDefault();
        console.log(this.refs.playerName.value);
        this.props.finalizeLogin(this.refs.playerName.value);
        hashHistory.push('dashboard.html');
    };
      
    return <div>
        <form onSubmit={onLogin}>
            <input ref="playerName" type="text" name="name" />
            <input type="submit" />
        </form>
    </div>;
  }
};