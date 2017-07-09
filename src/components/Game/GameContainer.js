import {connect} from 'react-redux';
import Game from './native/Game';
import GameModel from '../../models/Game';
import {
  endGame,
  resizeGameSurface,
  startListeningForGameUpdates,
  suspendGame,
  nextTutorialStep,
  popPageUntil,
  updateGame,
  requestGame,
} from '../../actions/index';
import {PAGES} from '../../models/Page';
import Logger from '../../logger';

const mapStateToProps = (state, ownProps) => {
  const playerID = state.app.player.id;
  const opponentID = GameModel.getOpponentID(state.game, playerID);
  const player = GameModel.getPlayer(state.game, playerID);
  const opponent = GameModel.getOpponent(state.game, playerID);
  const size = state.app.surfaceWidth < state.app.surfaceHeight
    ? state.app.surfaceWidth
    : state.app.surfaceHeight;
  const marginSize = state.app.surfaceWidth < state.app.surfaceHeight
    ? state.app.surfaceHeight - state.app.surfaceWidth
    : state.app.surfaceWidth - state.app.surfaceHeight;
  const gameHasEnded = GameModel.hasEnded(state.game);

  const lastMoves = [];
  let lastActingPlayer = null;
  if (state.game.moves) {
    for (let i = state.game.moves.length - 1; i >= 0; i--) {
      if (
        lastActingPlayer === null || state.game.moves[i].player === lastActingPlayer
      ) {
        lastActingPlayer = state.game.moves[i].player;
      } else {
        break;
      }
      lastMoves.push(state.game.moves[i]);
    }
  }

  return {
    won: gameHasEnded && GameModel.getWinner(state.game) === playerID,
    lost: gameHasEnded && GameModel.getWinner(state.game) !== playerID,
    game: state.app.currentGame,
    playerID,
    player,
    opponent,
    playerIDs: Object.keys(state.game.players),
    towerPositionsForPlayer: GameModel.getTowersForPlayer(state.game, player.id),
    towerPositionsForOpponent: GameModel.getTowersForPlayer(state.game, opponent.id),
    rotateBoard: playerID < opponentID,
    myTurn: state.game.currentPlayer === playerID,
    size,
    marginSize,
    lastMoves,
    moves: state.game.moves,
    currentPlayer: state.game.currentPlayer,
    currentColor: state.game.currentColor,
    fieldSize: size / 8,
    lastMoveByMe: lastMoves.length > 0 && playerID === lastActingPlayer,
    inTutorial: state.game.isTutorial,
    inAIGame: state.game.isAIGame,
    tutorialMessage: state.game.tutorial.message,
    tutorialContinueOnMessageClick: state.game.tutorial.continueOnMessageClick,
    tutorialMessagePosition: state.game.tutorial.messagePosition,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  listenForGameUpdates: (gameKey) => {
    Logger.debug('listening for updates on ', gameKey);
    dispatch(startListeningForGameUpdates(gameKey));
  },
  suspendGame: (gameKey) => {
    dispatch(suspendGame(gameKey));
  },
  goToDashboard: () => {
    dispatch(popPageUntil(PAGES.DASHBOARD));
  },
  endGame: (gameKey, player) => {
    dispatch(endGame(gameKey, player));
  },
  endGameAndAskForRevenge: (gameKey, playerID, opponentID, hasWon) => {
    dispatch(endGame(gameKey, playerID));
    dispatch(requestGame(opponentID, hasWon ? opponentID : playerID));
  },
  resizeGameSurface: (width, height) => {
    dispatch(resizeGameSurface(width, height));
  },
  nextTutorialStep: () => {
    dispatch(nextTutorialStep());
  },
  updateGame: (newGameState) => {
    dispatch(updateGame(newGameState));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Game);
