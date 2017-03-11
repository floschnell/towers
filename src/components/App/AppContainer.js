import { connect } from 'react-redux';
import App from './native/App.js';
import db from '../../database.js';
import { setPlayer, waitForLogin } from '../../actions/index';
import firebase from 'firebase';
import {Actions} from 'react-native-router-flux'

const mapStateToProps = (state) => ({
    player: state.app.player,
    user: state.app.user,
    game: state.app.currentGame
});

const mapDispatchToProps = (dispatch) => ({
    login: player => dispatch(setPlayer(player)),
    waitForLogin: () => dispatch(waitForLogin())
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);
