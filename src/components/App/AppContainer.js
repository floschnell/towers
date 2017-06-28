import {connect} from 'react-redux';
import App from './native/App.js';
import {
  waitForLogin,
  logout,
  popPage,
  pushPage,
  resizeGameSurface,
  clearMessage,
  cancelLoading,
  executeBackButtonAction,
  executeForwardButtonAction,
} from '../../actions/index';
import {Page, PAGES} from '../../models/Page';

const mapStateToProps = (state) => ({
  player: state.app.player,
  isLoggedIn: state.app.player !== null,
  user: state.app.user,
  game: state.app.currentGame,
  currentPage: Page.fromJson(
    state.navigation.pageStack[state.navigation.pageStack.length - 1]
  ),
  openPages: state.navigation.pageStack.length,
  screenWidth: state.app.surfaceWidth,
  isLoading: state.app.isLoading,
  loadingMessage: state.app.loadingMessage,
  message: state.app.message,
});

const mapDispatchToProps = (dispatch) => ({
  waitForLogin: () => dispatch(waitForLogin()),
  logOut: () => {
    dispatch(logout());
  },
  navigateBack: () => {
    dispatch(popPage());
  },
  resizeGameSurface: (width, height) => {
    dispatch(resizeGameSurface(width, height));
  },
  clearMessage: () => {
    dispatch(clearMessage());
  },
  cancelLoading: () => {
    dispatch(cancelLoading());
  },
  executeBackButtonAction: (page) => {
    dispatch(executeBackButtonAction(page));
  },
  executeForwardButtonAction: (page) => {
    dispatch(executeForwardButtonAction(page));
  },
  gotoDashboard: (playerName) => {
    dispatch(pushPage(PAGES.DASHBOARD.withTitle(`Playing as ${playerName}`)));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
