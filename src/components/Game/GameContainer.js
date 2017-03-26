import { connect } from 'react-redux';
import Game from './native/Game';
import {
  updateGame,
  endGame,
  resizeGameSurface,
  startListeningForGameUpdates,
  goToPage,
  suspendGame,
  nextTutorialStep
} from '../../actions/index';
import { playerMoveDirection, getOpponent } from '../../gamelogic.js';
import db from '../../database';
import { PAGES } from '../../models/Page';

const mapStateToProps = (state, ownProps) => {
  const playerIDs = Object.keys(state.game.players);
  const playerID = state.app.player.id;
  const opponentID = getOpponent(playerID, playerIDs);
  const targetRow = (playerA, playerB) => playerMoveDirection(playerA, [playerA, playerB]) === 1 ? 7 : 0;
  const size = state.app.surfaceWidth < state.app.surfaceHeight ? state.app.surfaceWidth : state.app.surfaceHeight;
  const marginSize = state.app.surfaceWidth < state.app.surfaceHeight ? state.app.surfaceHeight - state.app.surfaceWidth : state.app.surfaceWidth - state.app.surfaceHeight;

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
    won: state.game.towerPositions[playerID].some(tower => tower.y === targetRow(playerID, opponentID)),
    lost: state.game.towerPositions[opponentID].some(tower => tower.y === targetRow(opponentID, playerID)),
    game: state.app.currentGame,
    playerID,
    player: state.game.players[playerID],
    opponent: state.game.players[opponentID],
    playerIDs: Object.keys(state.game.players),
    towerPositions: state.game.towerPositions,
    rotateBoard: playerID < opponentID,
    myTurn: state.game.currentPlayer === playerID,
    size,
    marginSize,
    lastMoves,
    fieldSize: size / 8,
    lastMoveByMe: lastMoves.length > 0 && playerID === player,
    inTutorial: state.game.isTutorial,
    tutorialMessage: state.game.tutorial.message,
    tutorialContinueOnMessageClick: state.game.tutorial.continueOnMessageClick,
    tutorialMessagePosition: state.game.tutorial.messagePosition
  }
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  listenForGameUpdates: (gameKey) => {
    console.log('listening for updates on ', gameKey)
    dispatch(startListeningForGameUpdates(gameKey));
  },
  suspendGame: gameKey => {
    dispatch(suspendGame(gameKey));
  },
  endGame: (gameKey, player) => {
    dispatch(endGame(gameKey, player));
  },
  resizeGameSurface: (width, height) => {
    resizeGameSurface(dispatch, width, height);
  },
  nextTutorialStep: () => {
    dispatch(nextTutorialStep())
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Game);