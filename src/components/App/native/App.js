import React from 'react';

import {
    Scene,
    Router
} from 'react-native-router-flux';

import {
    StyleSheet,
    Text,
    View,
    AsyncStorage,
    Dimensions,
    Navigator,
    Platform
} from 'react-native';

import firebase from 'firebase';
import LoginContainer from '../../Login/LoginContainer';
import DashboardContainer from '../../Dashboard/DashboardContainer';
import GameContainer from '../../Game/GameContainer';
import CreateGameContainer from '../../CreateGame/CreateGameContainer';
import CreateAccountContainer from '../../CreateAccount/CreateAccountContainer';

export default class App extends React.Component {

    componentWillMount() {
        this.props.waitForLogin();
    }

    render() {
        const windowDimensions = Dimensions.get('window');
        const navbarHeight = Platform.select({
            ios: 64,
            android: 54
        });

        return <Router>
                    <Scene key="root" style={{paddingTop: navbarHeight}}>
                        <Scene key="login" component={LoginContainer} title="Login" initial="true" />
                        <Scene key="register" component={CreateAccountContainer} title="Create Account" />
                        <Scene key="dashboard" component={DashboardContainer} title="Dashboard" />
                        <Scene key="createGame" component={CreateGameContainer} title="Create Game" />
                        <Scene key="game" component={GameContainer} width={windowDimensions.width} height={windowDimensions.height - navbarHeight} />
                    </Scene>
                </Router>;
    }
}
