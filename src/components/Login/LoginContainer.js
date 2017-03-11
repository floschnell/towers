import { connect } from 'react-redux';
import Login from './native/Login';
import firebase from 'firebase';
import db from '../../database';
import { login } from '../../actions/index';

const mapStateToProps = (state, ownProps) => ({
    isLoading: state.app.isLoading,
    loadingMessage: state.app.loadingMessage
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    finalizeLogin: (email, password) => {
        dispatch(login(email, password));
    }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);