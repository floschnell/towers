import {connect} from 'react-redux';
import CreateAccount from './native/CreateAccount';
import {
  createAccount,
  popPageUntil,
  checkUsername,
} from '../../actions/index';
import {PAGES} from '../../models/Page';

const mapStateToProps = (state, ownProps) => ({
  isLoading: state.app.isLoading,
  usernameValid: state.app.usernameValid,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  createAccount: (username, email, password, passwordRepeat) => {
    if (password !== passwordRepeat) {
      alert('Passwords do not match!');
      return;
    }

    dispatch(createAccount(username, email, password));
  },
  checkUsername: (username) => {
    dispatch(checkUsername(username));
  },
  goBack: () => {
    dispatch(popPageUntil(PAGES.LOGIN));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateAccount);
