import { connect } from 'react-redux';
import CreateAccount from './CreateAccount';
import {setPlayerName} from '../../actions/index';
import db from '../../database';
import { hashHistory } from 'react-router';

const mapStateToProps = (state, ownProps) => ({
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    createAccount: (username, email, password, passwordRepeat) => {
        if (password !== passwordRepeat) {
            console.warn('Passwords do not match!');
            return;
        }
        
        if (username.length < 3) {
            console.warn('Username is too short');
        }
        
        if (!/[\w]{0,}[\w\s]*/.test(username)) {
            console.warn('Username is too short');
        }
        
        firebase.auth().createUserWithEmailAndPassword(email, password).then(result => {
            const playerRef = db.ref(`players/${result.uid}`);
            return playerRef.set({
                    name: username,
                    searchName: username.toLowerCase()
            });
        }).then(() => {
            const user = firebase.auth().currentUser;
            dispatch(setPlayerName(user.uid));
            hashHistory.push('dashboard.html');
        }).catch(error => {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            console.warn(errorCode, errorMessage);
        });
    }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateAccount);