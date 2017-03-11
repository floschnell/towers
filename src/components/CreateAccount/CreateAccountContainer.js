import { connect } from 'react-redux';
import CreateAccount from './native/CreateAccount';
import { createAccount } from '../../actions/index';
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

        dispatch(createAccount(username, email, password));
    }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateAccount);