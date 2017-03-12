import { connect } from 'react-redux';
import App from './native/App.js';
import db from '../../database.js';
import { setPlayer, waitForLogin } from '../../actions/index';
import firebase from 'firebase';

const mapStateToProps = (state) => ({
    player: state.app.player,
    user: state.app.user,
    game: state.app.currentGame,
    currentPage: state.app.currentPage
});

const mapDispatchToProps = (dispatch) => ({
    waitForLogin: () => dispatch(waitForLogin())
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);
