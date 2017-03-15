import { connect } from 'react-redux';
import Login from './native/Login';
import firebase from 'firebase';
import db from '../../database';
import { login, pushPage } from '../../actions/index';
import { PAGES } from '../../models/Page';

const mapStateToProps = (state, ownProps) => ({
    isLoading: state.app.isLoading,
    loadingMessage: state.app.loadingMessage
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    finalizeLogin: (email, password) => {
        dispatch(login(email, password));
    },
    createAccount: () => {
        dispatch(pushPage(PAGES.REGISTRATION));
    }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
