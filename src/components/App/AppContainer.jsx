import { connect } from 'react-redux';
import App from './App';
import db from '../../database';
import { setPlayer } from '../../actions/index';

const mapStateToProps = (state) => ({
    user: state.app.user
});

const mapDispatchToProps = (dispatch) => ({
    login: player => dispatch(setPlayer(player))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);