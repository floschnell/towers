import { connect } from 'react-redux';
import Field from './native/Field';
import {newGame, clickOnField} from '../../actions/index';
import Game from '../../models/Game';
import GameLogic from '../../gamelogic';

const mapStateToProps = (state, ownProps) => {
    const getCurrentColor = () => {
        if (typeof state.game.currentColor === 'number') {
            return state.game.currentColor;
        } else if (state.game.selectedTower) {
            return state.game.selectedTower.color;
        } else {
            return null;
        }
    };
    const getSourceField = () => {
        if (typeof state.game.currentColor === 'number') {
            return state.game.towerPositions[state.game.currentPlayer][state.game.currentColor];
        } else if (state.game.selectedTower) {
            return state.game.selectedTower;
        } else {
            return null;
        }
    };
    const checkIfFieldCanBeReached = () => {
        const sourceField = getSourceField();
        const targetField = {
            x: ownProps.x,
            y: ownProps.y
        };
        if (sourceField) {
            return GameLogic.checkMove(state.game.towerPositions, {
                player: state.game.currentPlayer,
                color: getCurrentColor(),
                sourceField,
                targetField
            });
        } else {
            false;
        }
    };

    return {
        playerID: state.app.player.id,
        opponentID: Game.getOpponentUID(state.game, state.app.player.id),
        currentGame: state.app.currentGame,
        myTurn: state.app.player.id === state.game.currentPlayer,
        canBeReached: checkIfFieldCanBeReached()
    };
};

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