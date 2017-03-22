import { connect } from 'react-redux';
import Field from './native/Field';
import {newGame, clickOnField} from '../../actions/index';
import Game from '../../models/Game';

const mapStateToProps = (state, ownProps) => ({
    playerID: state.app.player.id,
    opponentID: Game.getOpponentUID(state.game, state.app.player.id),
    currentGame: state.app.currentGame
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    onClick: (playerID, opponentID, currentGame) => {
        dispatch(clickOnField({
            x: ownProps.x,
            y: ownProps.y,
            color: ownProps.color
        }, playerID, opponentID, currentGame));
    }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Field);