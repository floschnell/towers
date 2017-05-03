import {connect} from 'react-redux';
import Login from './native/Login';
import {login, pushPage} from '../../actions/index';
import {PAGES} from '../../models/Page';

const mapStateToProps = (state, ownProps) => ({
  authState: state.app.authState,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  finalizeLogin: (id, password) => {
    dispatch(login(id, password));
  },
  createAccount: () => {
    dispatch(pushPage(PAGES.REGISTRATION));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
