import { connect } from 'react-redux';
import PushController from './PushController';
import { updateToken, loadGame } from '../../actions/index';

const mapStateToProps = (state, ownProps) => ({
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    onChangeToken: token => {
        dispatch(updateToken(token));
    },
    goToGame: gameKey => {
        dispatch(loadGame(gameKey));
    }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PushController);