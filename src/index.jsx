import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, compose } from 'redux';
import {Provider} from 'react-redux';
import reducer from './reducers/index';
import { Router, Route, Link, hashHistory } from 'react-router'

import Game from './components/Game/Game';
import BoardContainer from './components/Board/BoardContainer';
import LoginContainer from './components/Login/LoginContainer';
import DashboardContainer from './components/Dashboard/DashboardContainer';
import CreateGameContainer from './components/CreateGame/CreateGameContainer';
import CreateAccountContainer from './components/CreateAccount/CreateAccountContainer';

const store = createStore(reducer);

ReactDOM.render(
  <Provider store={store}>
    <Router history={hashHistory}>
      <Route path="/main.html" component={Game}/>
      <Route path="/dashboard.html" component={DashboardContainer}/>
      <Route path="/newGame.html" component={CreateGameContainer}/>
      <Route path="/createAccount.html" component={CreateAccountContainer}/>
      <Route path="/" component={LoginContainer}/>
    </Router>
  </Provider>,
  document.getElementById('app')
);