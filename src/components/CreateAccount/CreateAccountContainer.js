import { connect } from 'react-redux';
import CreateAccount from './native/CreateAccount';
import { setPlayerName, endLoading, startLoading, setPlayer } from '../../actions/index';
import db from '../../database';
import firebase from 'firebase';

const mapStateToProps = (state, ownProps) => ({
    isLoading: state.app.isLoading
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    createAccount: (username, email, password, passwordRepeat) => {
        if (password !== passwordRepeat) {
            alert('Passwords do not match!');
            return;
        }
        
        if (username.length < 3) {
            alert('Username is too short');
        }
        
        if (!/[\w]{0,}[\w\s]*/.test(username)) {
            alert('Username is too short');
        }
        
        const playerObj = {
            name: username,
            searchName: username.toLowerCase()
        };

        dispatch(startLoading());
        firebase.auth().createUserWithEmailAndPassword(email, password).then(result => {
            const playerRef = db.ref(`players/${result.uid}`);
            
            return playerRef.set(playerObj);
        }).then(() => {
            const user = firebase.auth().currentUser;
            playerObj.uid = user.uid;

            dispatch(setPlayer(playerObj, user));
            dispatch(endLoading());
        }).catch(error => {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            alert(`Unknown error: ${errorCode} ${errorMessage}`);
            dispatch(endLoading());
        });
    }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateAccount);