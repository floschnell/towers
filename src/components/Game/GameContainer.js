import { connect } from 'react-redux';
import Game from './native/Game';
import {
  updateGame,
  endGame,
  resizeGameSurface,
  startListeningForGameUpdates,
  stopListeningForGameUpdates,
  goToPage
} from '../../actions/index';
import { playerMoveDirection, getOpponent } from '../../gamelogic.js';
import db from '../../database';
import { PAGES } from '../../models/Page';

const mapStateToProps = (state, ownProps) => {
  const playerUIDs = Object.keys(state.game.players);
  const thisPlayerUID = state.app.player.uid;
  const opponentPlayerUID = getOpponent(thisPlayerUID, playerUIDs);
  const targetRow = (playerA, playerB) => playerMoveDirection(playerA, [playerA, playerB]) === 1 ? 7 : 0;

  return { 
    won: state.game.towerPositions[thisPlayerUID].some(tower => tower.y === targetRow(thisPlayerUID, opponentPlayerUID)),
    lost: state.game.towerPositions[opponentPlayerUID].some(tower => tower.y === targetRow(opponentPlayerUID, thisPlayerUID)),
    game: state.app.currentGame,
    playerUID: state.app.player.uid,
    surfaceWidth: state.app.surfaceWidth,
    surfaceHeight: state.app.surfaceHeight,
    playerUIDs: Object.keys(state.game.players),
    towerPositions: state.game.towerPositions
  }
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  endGame: (game, player) => {
    endGame(dispatch, game, player);
  },
  resizeGameSurface: (width, height) => {
    resizeGameSurface(dispatch, width, height);
  },
  subscribeToUpdates: gameKey => {
    startListeningForGameUpdates(gameKey);
  },
  unsubscribeFromUpdates: gameKey => {
    stopListeningForGameUpdates(gameKey);
  },
  goToDashboard: () => {
    dispatch(goToPage(PAGES.DASHBOARD));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Game);