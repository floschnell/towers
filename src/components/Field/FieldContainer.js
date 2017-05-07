import {connect} from 'react-redux';
import Field from './native/Field';
import {clickOnField} from '../../actions/index';
import Game, {CHECK_MOVE_RESULT} from '../../models/Game';

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
      return Game.getTowerForPlayerAndColor(
        state.game,
        state.game.currentPlayer,
        state.game.currentColor
      );
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
      y: ownProps.y,
    };
    if (sourceField) {
      const moveResult = Game.checkMoveForValidity(state.game, {
        player: state.game.currentPlayer,
        color: getCurrentColor(),
        sourceField,
        targetField,
      });
      return moveResult === CHECK_MOVE_RESULT.VALID;
    } else {
      false;
    }
  };

  return {
    playerID: state.app.player.id,
    opponentID: Game.getOpponentID(state.game, state.app.player.id),
    currentGame: state.app.currentGame,
    myTurn: state.app.player.id === state.game.currentPlayer,
    canBeReached: checkIfFieldCanBeReached(),
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  onClick: (playerID, opponentID, currentGame) => {
    dispatch(
      clickOnField(
        {
          x: ownProps.x,
          y: ownProps.y,
          color: ownProps.color,
        },
        playerID,
        opponentID,
        currentGame
      )
    );
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Field);
