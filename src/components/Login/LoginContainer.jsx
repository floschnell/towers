import { connect } from 'react-redux';
import Login from './Login';
import {setPlayerName} from '../../actions/index';

const mapStateToProps = (state, ownProps) => ({
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    finalizeLogin: playerName => {
        dispatch(setPlayerName(playerName));
    }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);