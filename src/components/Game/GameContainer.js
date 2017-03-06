import { connect } from 'react-redux';
import Game from './native/Game';
import { resumeGame, startGame, endGame, resizeGameSurface } from '../../actions/index';
import { playerMoveDirection, getOpponent } from '../../gamelogic.js';

const mapStateToProps = (state, ownProps) => {
  const gameIsLoading = state.game.currentPlayer === null;
  const playerUIDs = Object.keys(state.game.players);
  const thisPlayerUID = state.app.player.uid;
  const opponentPlayerUID = getOpponent(thisPlayerUID, playerUIDs);
  const targetRow = (playerA, playerB) => playerMoveDirection(playerA, [playerA, playerB]) === 1 ? 7 : 0;

  return {
    won: gameIsLoading ? false : state.game.towerPositions[thisPlayerUID].some(tower => tower.y === targetRow(thisPlayerUID, playerUIDs)),
    lost: gameIsLoading ? false : state.game.towerPositions[opponentPlayerUID].some(tower => tower.y === targetRow(opponentPlayerUID, playerUIDs)),
    game: state.app.currentGame,
    playerName: state.app.player.uid,
    surfaceWidth: state.app.surfaceWidth,
    surfaceHeight: state.app.surfaceHeight,
    playerUIDs: Object.keys(state.game.players),
    towerPositions: state.game.towerPositions
  }
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  endGame: (game, player) => {
    endGame(dispatch, game, player);
    hashHistory.push('dashboard.html');
  },
  resizeGameSurface: (width, height) => {
    resizeGameSurface(dispatch, width, height);
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Game);