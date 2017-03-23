import { connect } from 'react-redux';
import App from './native/App.js';
import db from '../../database.js';
import { setPlayer, waitForLogin, logout, popPage, resizeGameSurface, clearMessage } from '../../actions/index';
import firebase from 'firebase';

const mapStateToProps = (state) => ({
    player: state.app.player,
    user: state.app.user,
    game: state.app.currentGame,
    currentPage: state.app.pageStack[state.app.pageStack.length - 1],
    openPages: state.app.pageStack.length,
    screenWidth: state.app.surfaceWidth,
    isLoading: state.app.isLoading,
    loadingMessage: state.app.loadingMessage,
    message: state.app.message
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
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);
