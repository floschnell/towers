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
    Platform,
    Alert,
    BackAndroid
} from 'react-native';

import firebase from 'firebase';
import LoginContainer from '../../Login/LoginContainer';
import DashboardContainer from '../../Dashboard/DashboardContainer';
import GameContainer from '../../Game/GameContainer';
import CreateGameContainer from '../../CreateGame/CreateGameContainer';
import CreateAccountContainer from '../../CreateAccount/CreateAccountContainer';
import NavigationBar from 'react-native-navigation-bar';
import { PAGES } from '../../../models/Page';

export default class App extends React.Component {

    onLogOut() {
        Alert.alert('Log Out', 'Are you sure that you want to log out?', [
            {
                text: 'No', onPress: () => {}
            },
            {
                text: 'Yes', onPress: () => {
                    this.props.logOut();
                }
            }
        ], { cancelable: false } );
    }

    onExit() {
        Alert.alert('Exit?', 'Do you want to exit Towers?', [
            {
                text: 'No', onPress: () => {}
            },
            {
                text: 'Yes', onPress: () => {
                    
                }
            }
        ], { cancelable: false } );
    }

    onBack() {
        if (this.props.currentPage.getName() === PAGES.DASHBOARD.getName()) {
            this.onLogOut();
        } else if (this.props.currentPage.getName() === PAGES.LOGIN.getName()) {
            this.onExit();
        } else {
            this.props.navigateBack();
        }
        return true;
    }

    componentWillMount() {
        this.props.waitForLogin();

        BackAndroid.addEventListener('hardwareBackPress', this.onBack.bind(this));
    }

    renderPage() {
        const loggedIn = (this.props.player !== null);

        if (PAGES.REGISTRATION.equals(this.props.currentPage)) {
            return <CreateAccountContainer />;

        } else if (PAGES.DASHBOARD.equals(this.props.currentPage) && loggedIn) {
            return <DashboardContainer />;

        } else if (PAGES.GAME.equals(this.props.currentPage) && loggedIn) {
            const windowDimensions = Dimensions.get('window');

            return <GameContainer width={windowDimensions.width} height={windowDimensions.height} />;

        } else if (PAGES.CREATE_GAME.equals(this.props.currentPage) && loggedIn) {
            return <CreateGameContainer />;

        } else {
            return <LoginContainer />;

        }
    }

    renderNavigationBar() {
        const backButton = this.props.openPages > 1 ? 'back' : null;

        return <NavigationBar 
            title={this.props.currentPage.getTitle()}
            height={44}
            titleColor={'#fff'}
            backgroundColor={'#149be0'}
            leftButtonTitle={backButton}
            leftButtonTitleColor={'#fff'}
            onLeftButtonPress={this.onBack.bind(this)}
        />
    }

    render() {
        return <View style={{flex: 1}}>
            {this.renderNavigationBar()}
            <View style={{flex: 1, marginTop: 44}}>
                {this.renderPage()}
            </View>
        </View>;
    }
}
