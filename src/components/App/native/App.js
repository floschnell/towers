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
    BackAndroid,
    StatusBar,
    ActivityIndicator,
    Modal,
    ToastAndroid
} from 'react-native';

import firebase from 'firebase';
import LoginContainer from '../../Login/LoginContainer';
import DashboardContainer from '../../Dashboard/DashboardContainer';
import GameContainer from '../../Game/GameContainer';
import CreateGameContainer from '../../CreateGame/CreateGameContainer';
import CreateAccountContainer from '../../CreateAccount/CreateAccountContainer';
import NavigationBar from '../../NavigationBar/native/NavigationBar';
import PushController from '../../PushController/PushControllerContainer';
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
                    BackAndroid.exitApp();
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
            return <GameContainer />;

        } else if (PAGES.CREATE_GAME.equals(this.props.currentPage) && loggedIn) {
            return <CreateGameContainer />;

        } else {
            return <LoginContainer />;

        }
    }

    renderPushController() {
        const loggedIn = (this.props.player !== null);

        if (loggedIn) {
            return <PushController />;
        } else {
            return null;
        }
    }

    renderNavigationBar() {
        return <NavigationBar 
            title={this.props.currentPage.getTitle()}
            height={44}
            titleColor={'#fff'}
            backgroundColor={'#149be0'}
            leftButtonTitle={this.props.currentPage.getBackButton()}
            leftButtonTitleColor={'#fff'}
            onLeftButtonPress={this.onBack.bind(this)}
        />
    }

    onLayout() {
        const windowDimensions = Dimensions.get('window');

        this.props.resizeGameSurface(windowDimensions.width, windowDimensions.height - 44 - StatusBar.currentHeight);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.message) {
            ToastAndroid.show(nextProps.message, 2000);
            nextProps.clearMessage();
        }
    }

    renderActivityIndicator() {
        if (this.props.isLoading) {
            return <Modal onRequestClose={() => false} transparent={true}>
                <View style={{alignItems: 'center', justifyContent: 'center', position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, backgroundColor: 'rgba(255, 255, 255, 0.8)'}}>
                <ActivityIndicator size="large" />
                <Text>{this.props.loadingMessage}</Text>
                </View>
            </Modal>;
        } else {
            return null;
        }
    }

    render() {
        return <View style={{flex: 1}} onLayout={this.onLayout.bind(this)}>
            {this.renderPushController()}
            {this.renderNavigationBar()}
            <View style={{flex: 1}}>
                {this.renderPage()}
                {this.renderActivityIndicator()}
            </View>
        </View>;
    }
}
