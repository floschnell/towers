import { connect } from 'react-redux';
import PushController from './PushController';
import { updateToken, loadGameFromKey, popPageUntil } from '../../actions/index';
import db from '../../database';
import { PAGES } from '../../models/Page';

const mapStateToProps = (state, ownProps) => ({
    game: state.app.currentGame
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    onChangeToken: token => {
        dispatch(updateToken(token));
    },
    goToGame: gameKey => {
        dispatch(popPageUntil(PAGES.DASHBOARD));
        dispatch(loadGameFromKey(gameKey));
    }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PushController);