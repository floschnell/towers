import { connect } from 'react-redux';
import Field from './native/Field';
import {newGame, clickOnField} from '../../actions/index';
import Game from '../../models/Game';

const mapStateToProps = (state, ownProps) => ({
    playerUid: state.app.player.uid,
    opponentUid: Game.getOpponentUID(state.game, state.app.player.uid),
    currentGame: state.app.currentGame
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    onClick: (playerUid, opponentUid, currentGame) => {
        dispatch(clickOnField({
            x: ownProps.x,
            y: ownProps.y,
            color: ownProps.color
        }, playerUid, opponentUid, currentGame));
    }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Field);