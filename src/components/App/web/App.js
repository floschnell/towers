import React from 'react';
import { Router, Route, Link, hashHistory } from 'react-router';
import firebase from 'firebase';
import db from '../../../database';

import GameContainer from '../../Game/GameContainer';
import BoardContainer from '../../Board/BoardContainer';
import LoginContainer from '../../Login/LoginContainer';
import DashboardContainer from '../../Dashboard/DashboardContainer';
import CreateGameContainer from '../../CreateGame/CreateGameContainer';
import CreateAccountContainer from '../../CreateAccount/CreateAccountContainer';

export default class App extends React.Component {
  
    componentWillMount() {
        if (!this.props.user) {
            hashHistory.push('/');
        }

        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                db.ref(`players/${user.uid}`).once('value').then(snapshot => {
                    const dbUser = snapshot.val();
                    dbUser.uid = user.uid;
                    this.props.login(dbUser);
                    console.log('you got logged in');
                    hashHistory.push('/dashboard.html');
                }).catch(err => {
                    firebase.auth().signOut();
                    console.log('login failed:', err);
                });
            } else {
                this.props.login(null);
                hashHistory.push('/');
            }
        });
    }

  render() {
        return <Router history={hashHistory}>
            <Route path="/main.html" component={GameContainer} />
            <Route path="/dashboard.html" component={DashboardContainer} />
            <Route path="/newGame.html" component={CreateGameContainer} />
            <Route path="/createAccount.html" component={CreateAccountContainer}/>
            <Route path="/" component={LoginContainer}/>
        </Router>;
  }
}
