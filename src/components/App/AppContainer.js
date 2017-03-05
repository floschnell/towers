import { connect } from 'react-redux';
import App from './native/App.js';
import db from '../../database.js';
import { setPlayer } from '../../actions/index';
import firebase from 'firebase';

const mapStateToProps = (state) => ({
    player: state.app.player,
    user: state.app.user,
    game: state.app.currentGame
});

const mapDispatchToProps = (dispatch) => ({
    login: player => dispatch(setPlayer(player)),
    listenForAuthentication: storage => {
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                db.ref(`players/${user.uid}`).once('value').then(snapshot => {
                    const dbUser = snapshot.val();
                    dbUser.uid = user.uid;
                    dispatch(setPlayer(dbUser, user));
                    console.log('you got logged in');
                }).catch(err => {
                    firebase.auth().signOut();
                    console.log('login failed:', err);
                });
            } else {
                dispatch(setPlayer(null))
            }
        });
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);
