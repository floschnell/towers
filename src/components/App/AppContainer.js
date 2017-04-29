import {connect} from 'react-redux';
import App from './native/App.js';
import {
  waitForLogin,
  logout,
  popPage,
  resizeGameSurface,
  clearMessage,
  cancelLoading,
} from '../../actions/index';
import {Page} from '../../models/Page';

const mapStateToProps = (state) => ({
  player: state.app.player,
  user: state.app.user,
  game: state.app.currentGame,
  currentPage: Page.fromJson(state.app.pageStack[state.app.pageStack.length - 1]),
  openPages: state.app.pageStack.length,
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
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
