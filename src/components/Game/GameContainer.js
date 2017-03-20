import { connect } from 'react-redux';
import Game from './native/Game';
import {
  updateGame,
  endGame,
  resizeGameSurface,
  startListeningForGameUpdates,
  stopListeningForGameUpdates,
  goToPage,
  suspendGame
} from '../../actions/index';
import { playerMoveDirection, getOpponent } from '../../gamelogic.js';
import db from '../../database';
import { PAGES } from '../../models/Page';

const mapStateToProps = (state, ownProps) => {
  const playerUIDs = Object.keys(state.game.players);
  const thisPlayerUID = state.app.player.uid;
  const opponentPlayerUID = getOpponent(thisPlayerUID, playerUIDs);
  const targetRow = (playerA, playerB) => playerMoveDirection(playerA, [playerA, playerB]) === 1 ? 7 : 0;
  const size = state.app.surfaceWidth < state.app.surfaceHeight ? state.app.surfaceWidth : state.app.surfaceHeight;

  const lastMoves = [];
  let player = null;
  if (state.game.moves) {
    for (let i = state.game.moves.length - 1; i >= 0; i--) {
      if (player === null || state.game.moves[i].player === player) {
        player = state.game.moves[i].player;
      } else {
        break;
      }
      lastMoves.push(state.game.moves[i]);
    }
  }

  return { 
    won: state.game.towerPositions[thisPlayerUID].some(tower => tower.y === targetRow(thisPlayerUID, opponentPlayerUID)),
    lost: state.game.towerPositions[opponentPlayerUID].some(tower => tower.y === targetRow(opponentPlayerUID, thisPlayerUID)),
    game: state.app.currentGame,
    playerUID: thisPlayerUID,
    player: state.game.players[thisPlayerUID],
    opponent: state.game.players[opponentPlayerUID],
    playerUIDs: Object.keys(state.game.players),
    towerPositions: state.game.towerPositions,
    rotateBoard: thisPlayerUID < opponentPlayerUID,
    myTurn: state.game.currentPlayer === thisPlayerUID,
    size,
    lastMoves,
    fieldSize: size / 8,
    lastMoveByMe: lastMoves.length > 0 && thisPlayerUID === player
  }
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  endGame: (gameKey, player) => {
    dispatch(endGame(gameKey, player));
  },
  resizeGameSurface: (width, height) => {
    resizeGameSurface(dispatch, width, height);
  },
  goToDashboard: () => {
    dispatch(suspendGame());
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Game);