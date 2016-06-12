import { connect } from 'react-redux';
import Login from './Login';
import {setPlayerName} from '../../actions/index';
import db from '../../database';
import passwordHash from 'password-hash';
import { hashHistory } from 'react-router';

const mapStateToProps = (state, ownProps) => ({
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    finalizeLogin: (email, password) => {
        firebase.auth().signInWithEmailAndPassword(email, password).then(user => {
            console.log(user.uid);
            dispatch(setPlayerName(user.uid));
            hashHistory.push('dashboard.html');
        }).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorCode + errorMessage);
        });
    }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);