import { connect } from 'react-redux';
import CreateAccount from './native/CreateAccount';
import { createAccount, goToPage, checkUsername } from '../../actions/index';
import { PAGES } from '../../models/Page';
import db from '../../database';
import firebase from 'firebase';

const mapStateToProps = (state, ownProps) => ({
    isLoading: state.app.isLoading,
    usernameValid: state.app.usernameValid
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    createAccount: (username, email, password, passwordRepeat) => {
        if (password !== passwordRepeat) {
            alert('Passwords do not match!');
            return;
        }
        
        if (username.length < 3) {
            alert('Username is too short');
            return;
        }
        
        if (!/[\w]{0,}[\w\s]*/.test(username)) {
            alert('Username is not valid!');
            return;
        }

        dispatch(createAccount(username, email, password));
    },
    checkUsername: username => {
        dispatch(checkUsername(username));
    },
    goBack: () => {
        dispatch(goToPage(PAGES.LOGIN));
    }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateAccount);