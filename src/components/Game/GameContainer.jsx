import { connect } from 'react-redux';
import Game from './Game';
import { updateGames, resumeGame, startGame, endGame, resizeGameSurface } from '../../actions/index';
import { hashHistory } from 'react-router';

const mapStateToProps = (state, ownProps) => {
  const playerNumber = state.game.players.findIndex(uid => uid === state.game.currentPlayer);
  const opponentNumber = playerNumber === 1 ? 0 : 1;
  const targetRow = (playerNumber) => (playerNumber === 0) ? 7 : 0;
  return {
    won: state.game.towerPositions[playerNumber].some(tower => tower.y === targetRow(playerNumber)),
    lost: state.game.towerPositions[opponentNumber].some(tower => tower.y === targetRow(opponentNumber)),
    game: state.app.currentGame,
    playerName: state.app.player.uid,
    surfaceWidth: state.app.surfaceWidth,
    surfaceHeight: state.app.surfaceHeight,
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