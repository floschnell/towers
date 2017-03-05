import { connect } from 'react-redux';
import Login from './native/Login';
import firebase from 'firebase';
import db from '../../database';
import {setPlayer} from '../../actions/index';

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