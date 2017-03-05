import { connect } from 'react-redux';
import Login from './Login';
import {setPlayer} from '../../actions/index';
import db from '../../database';
import { hashHistory } from 'react-router';
import firebase from 'firebase';

const mapStateToProps = (state, ownProps) => ({
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    finalizeLogin: (email, password) => {
        firebase.auth().signInWithEmailAndPassword(email, password).catch(error => {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorCode + errorMessage, error);
        });
    }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);