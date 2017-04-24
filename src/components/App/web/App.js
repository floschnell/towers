import React from 'react';
import {
    Router,
    Route,
    Link,
    hashHistory
} from 'react-router';
import firebase from 'firebase';
import db from '../../../database';
import GameContainer from '../../Game/GameContainer';
import BoardContainer from '../../Board/BoardContainer';
import LoginContainer from '../../Login/LoginContainer';
import DashboardContainer from '../../Dashboard/DashboardContainer';
import CreateGameContainer from '../../CreateGame/CreateGameContainer';
import CreateAccountContainer from '../../CreateAccount/CreateAccountContainer';
import Logger from '../../../logger';
import { PAGES } from '../../../models/Page';
import styles from './App.styl';

export default class App extends React.Component {

    componentWillMount() {
        this.props.waitForLogin();
    }

    render() {
        Logger.debug('page is:', this.props.currentPage.getName());
        const width = window.innerWidth;
        const height = window.innerHeight;

        switch (this.props.currentPage.getName()) {
            case PAGES.LOGIN.getName():
                return <LoginContainer />;
            case PAGES.REGISTRATION.getName():
                return <CreateAccountContainer />;
            case PAGES.DASHBOARD.getName():
                return <DashboardContainer />;
            case PAGES.CREATE_GAME.getName():
                return <CreateGameContainer />;
            case PAGES.GAME.getName():
                return <GameContainer surfaceWidth={width} surfaceHeight={height} />;
            default:
                return <LoginContainer />;
        }
    }
}