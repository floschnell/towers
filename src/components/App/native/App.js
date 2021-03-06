import {
  Text,
  View,
  Dimensions,
  Alert,
  BackHandler,
  StatusBar,
  ActivityIndicator,
  Modal,
  ToastAndroid,
} from 'react-native';
import PropTypes from 'prop-types';
import React from 'react';
import LoginContainer from '../../Login/LoginContainer';
import DashboardContainer from '../../Dashboard/DashboardContainer';
import GameContainer from '../../Game/GameContainer';
import CreateGameContainer from '../../CreateGame/CreateGameContainer';
import CreateAccountContainer from '../../CreateAccount/CreateAccountContainer';
import NavigationBar from '../../NavigationBar/native/NavigationBar';
import PushController from '../../PushController/PushControllerContainer';
import {PAGES} from '../../../models/Page';
import Logger from '../../../logger';

/**
 * Wrapper for the native application.
 * Manages windows, navigation and authentication.
 */
export default class App extends React.Component {
  /**
   * @override
   */
  componentWillMount() {
    this.props.waitForLogin();

    BackHandler.addEventListener('hardwareBackPress', this.onBack.bind(this));
  }

  /**
   * @override
   */
  onLayout() {
    const windowDimensions = Dimensions.get('window');

    this.props.resizeGameSurface(
      windowDimensions.width,
      windowDimensions.height - 44 - StatusBar.currentHeight
    );
  }

  /**
   * @override
   */
  componentWillReceiveProps(nextProps) {
    if (nextProps.message) {
      ToastAndroid.show(nextProps.message, 2000);
      nextProps.clearMessage();
    }

    if (nextProps.isLoggedIn && PAGES.LOGIN.equals(this.props.currentPage)) {
      nextProps.gotoDashboard(nextProps.player.name);
    }
  }

  /**
   * @override
   */
  render() {
    return (
      <View style={{flex: 1}} onLayout={this.onLayout.bind(this)}>
        {this.renderPushController()}
        {this.renderNavigationBar()}
        <View style={{flex: 1}}>
          {this.renderPage()}
          {this.renderActivityIndicator()}
        </View>
      </View>
    );
  }

  /**
   * Handles a user's request to exit the game.
   */
  onExit() {
    Alert.alert(
      'Exit?',
      'Do you want to exit Towers?',
      [
        {
          text: 'No',
          onPress: () => {},
        },
        {
          text: 'Yes',
          onPress: () => {
            BackHandler.exitApp();
          },
        },
      ],
      {cancelable: false}
    );
  }

  /**
   * Handles the user's request to navigate back.
   *
   * @return {boolean} Whether native back navigation is granted.
   */
  onBack() {
    if (this.props.currentPage.getName() === PAGES.DASHBOARD.getName()) {
      BackHandler.exitApp();
    } else if (this.props.currentPage.getName() === PAGES.LOGIN.getName()) {
      this.onExit();
    } else {
      this.props.navigateBack();
    }
    return true;
  }

  /**
   * Renders the current page.
   *
   * @return {React.Component}
   */
  renderPage() {
    if (this.props.isLoggedIn) {
      if (PAGES.DASHBOARD.equals(this.props.currentPage)) {
        return <DashboardContainer />;
      } else if (PAGES.GAME.equals(this.props.currentPage)) {
        return <GameContainer />;
      } else if (PAGES.CREATE_GAME.equals(this.props.currentPage)) {
        return <CreateGameContainer />;
      }
    } else {
      if (PAGES.REGISTRATION.equals(this.props.currentPage)) {
        return <CreateAccountContainer />;
      }
    }

    return <LoginContainer />;
  }

  /**
   * Renders the push message controller,
   * when a player is logged in.
   *
   * @return {null|PushController}
   */
  renderPushController() {
    if (this.props.isLoggedIn) {
      return <PushController />;
    } else {
      return null;
    }
  }

  /**
   * Will be executed when the player presses the forward
   * button on the navigation bar.
   *
   * @memberof App
   */
  pressForwardButton() {
    this.props.executeForwardButtonAction(this.props.currentPage);
  }

  /**
   * Will be executed when the player
   * - presses the back button in the navigation bar
   * - presses the hardware back button on his device.
   *
   * @memberof App
   */
  pressBackButton() {
    if (this.props.currentPage.equals(PAGES.DASHBOARD)) {
      Alert.alert(
        'Log Out',
        'Are you sure that you want to log out?',
        [
          {
            text: 'No',
            onPress: () => {},
          },
          {
            text: 'Yes',
            onPress: () => {
              this.props.executeBackButtonAction(this.props.currentPage);
            },
          },
        ],
        {cancelable: false}
      );
    } else {
      this.props.executeBackButtonAction(this.props.currentPage);
    }
  }

  /**
   * Renders the navigation bar.
   *
   * @return {NavigationBar}
   */
  renderNavigationBar() {
    Logger.debug('currentPage', this.props.currentPage);
    return (
      <NavigationBar
        title={this.props.currentPage.getTitle()}
        height={44}
        titleColor={'#fff'}
        backgroundColor={'#149be0'}
        leftButtonTitle={this.props.currentPage.getBackButton()}
        leftButtonTitleColor={'#fff'}
        onLeftButtonPress={this.pressBackButton.bind(this)}
        rightButtonTitle={this.props.currentPage.getForwardButton()}
        rightButtonTitleColor={'#fff'}
        onRightButtonPress={this.pressForwardButton.bind(this)}
      />
    );
  }

  /**
   * Renders the activity indicator, when there's a request
   * pending in the background.
   *
   * @return {React.Component}
   */
  renderActivityIndicator() {
    if (this.props.isLoading) {
      return (
        <Modal
          animationType={'fade'}
          onRequestClose={this.props.cancelLoading.bind(this)}
          transparent={true}
        >
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              position: 'absolute',
              left: 0,
              top: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
            }}
          >
            <ActivityIndicator size="large" />
            <Text>{this.props.loadingMessage}</Text>
          </View>
        </Modal>
      );
    } else {
      return null;
    }
  }
}

App.propTypes = {
  message: PropTypes.string,
  loadingMessage: PropTypes.string,
  cancelLoading: PropTypes.func,
  isLoading: PropTypes.bool,
  currentPage: PropTypes.object,
  player: PropTypes.object,
  isLoggedIn: PropTypes.bool,
  navigateBack: PropTypes.func,
  logOut: PropTypes.func,
  clearMessage: PropTypes.func,
  waitForLogin: PropTypes.func,
  resizeGameSurface: PropTypes.func,
  executeBackButtonAction: PropTypes.func,
  executeForwardButtonAction: PropTypes.func,
  gotoDashboard: PropTypes.func,
};
