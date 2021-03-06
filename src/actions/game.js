import AI from '../ai';
import Game from '../models/Game';
import Logger from '../logger';
import Rx from 'rxjs';
import db from '../database';
import {startLoading, endLoading, setSubscription, showMessage} from './app';
import {pushPage, popPage, replacePage, popPageUntil} from './navigation';
import {PAGES} from '../models/Page';
import Firebase from 'firebase';

export const GAME_ACTIONS = {
  RESUME_GAME: 'RESUME_GAME',
  START_GAME: 'START_GAME',
  UPDATE_GAME: 'UPDATE_GAME',
  SUSPEND_GAME: 'SUSPEND_GAME',
  LAUNCH_GAME_AGAINST_AI: 'LAUNCH_GAME_AGAINST_AI',
  CLICK_ON_TOWER: 'CLICK_ON_TOWER',
  CLICK_ON_FIELD: 'CLICK_ON_FIELD',
};

export const MOVE_RESULTS = {
  OK: 'OK',
  NOT_YOUR_TURN: 'NOT_YOUR_TURN',
  INVALID: 'INVALID',
  NO_TOWER_SELECTED: 'NO_TOWER_SELECTED',
};

/**
 * @type {AI}
 */
let computerPlayer = null;

/**
 * Launches a new game against the computer.
 *
 * @export
 * @param {string} player ID of the player.
 * @return {void}
 */
export function startGameAgainstAI(player) {
  return (dispatch) => {
    const aiCharacteristics = {
      blockedPenalty: 20 + (5 - Math.random() * 10),
      couldFinishBonus: 10 + (2 - Math.random() * 4),
      aggressiveness: 0.5 + (0.1 - Math.random() * 0.2),
    };

    const aiGamePage = PAGES.GAME.withTitle('Game vs. PC');
    dispatch(pushPage(aiGamePage));

    computerPlayer = new AI(aiCharacteristics);

    dispatch({
      type: GAME_ACTIONS.LAUNCH_GAME_AGAINST_AI,
      player,
      blockedPenalty: aiCharacteristics.blockedPenalty,
      couldFinishBonus: aiCharacteristics.couldFinishBonus,
      aggressiveness: aiCharacteristics.aggressiveness,
    });
  };
}

export const gameSuspended = () => ({
  type: GAME_ACTIONS.SUSPEND_GAME,
});

/**
 * Suspends the currently running game.
 *
 * @export
 * @param {string} gameKey
 * @return {void}
 */
export function suspendGame(gameKey) {
  return (dispatch, getState) => {
    Logger.debug(`suspending game: ${gameKey}`);
    const appState = getState();
    if (!appState.game.isAIGame) {
      db.child(`games/${gameKey}`).off();
    }
    dispatch(gameSuspended());
  };
}

/**
 * Accepts a request from another player and starts the according game.
 *
 * @export
 * @param {Player} player The player.
 * @param {Player} opponent Player's opponent.
 * @param {String} beginningPlayer Player that may start the game.
 * @return {void}
 */
export function acceptGameRequest(player, opponent, beginningPlayer) {
  return (dispatch) => {
    dispatch(startLoading('Accepting request ...'));
    const removeGameRequests = Promise.all([
      db
        .child(`requests/${opponent.id}/${player.id}`)
        .remove()
        .catch(() => Promise.resolve(null)),
      db
        .child(`requests/${player.id}/${opponent.id}`)
        .remove()
        .catch(() => Promise.resolve(null)),
    ]);

    removeGameRequests.then(() => {
      dispatch(
        startGame(
          player.id,
          opponent.id,
          {
            [player.id]: player,
            [opponent.id]: opponent,
          },
          beginningPlayer
        )
      );
    });
  };
}

/**
 * Decline a game request from a certain player.
 *
 * @export
 * @param {String} playerID Player's ID.
 * @param {String} opponentID Player's opponent's ID.
 * @return {void}
 */
export function declineGameRequest(playerID, opponentID) {
  return (dispatch) => {
    const removeGameRequests = Promise.all([
      db
        .child(`requests/${opponentID}/${playerID}`)
        .remove()
        .catch(() => Promise.resolve(null)),
      db
        .child(`requests/${playerID}/${opponentID}`)
        .remove()
        .catch(() => Promise.resolve(null)),
    ]);

    removeGameRequests.then(() => {
      dispatch(showMessage('Request has been declined.'));
    });
  };
}

/**
 * Sends a request to the given opponent.
 *
 * @export
 * @param {Player} opponent The opponent which will receive the game request.
 * @param {String} beginningPlayer Player that will begin the new game.
 * @return {void} Nothing useful.
 */
export function requestGame(opponent, beginningPlayer) {
  return (dispatch, getState) => {
    const player = getState().app.player;
    const requestRef = db.child(`requests/${opponent.id}/${player.id}`);
    const contender = {
      id: player.id,
      name: player.name,
    };
    const data = {
      when: Firebase.database.ServerValue.TIMESTAMP,
      beginningPlayer,
      contender,
    };

    dispatch(startLoading(`Sending request ...`));
    db
      .child(`requests/${player.id}/${opponent.id}`)
      .once('value')
      .then((snapshot) => {
        if (snapshot.exists()) {
          const request = snapshot.val();

          dispatch(acceptGameRequest(player, opponent, request.beginningPlayer));
          dispatch(showMessage(`${opponent.name} has accepted your request.`));
        } else {
          return requestRef.set(data).then(() => {
            dispatch(endLoading());
            dispatch(popPageUntil(PAGES.DASHBOARD));
            dispatch(showMessage(`Request has been sent to ${opponent.name}`));
          });
        }
      })
      .catch((e) => {
        Logger.error('Error while requesting a new game:', JSON.stringify(e));
        dispatch(endLoading());
        dispatch(showMessage('Could not send request to opponent. Please retry later.'));
      });
  };
}

/**
 * Starts to listen for updates of a specific game.
 * Every update will trigger an update game action.
 *
 * @export
 * @param {string} gameKey The game which to watch for changes.
 * @return {function(function(object):void):void}
 */
export function startListeningForGameUpdates(gameKey) {
  return (dispatch) => {
    db.child(`games/${gameKey}`).on('value', (snapshot) => {
      const gameState = snapshot.val();

      if (gameState !== null) {
        dispatch(updateGame(gameState));
      }
    });
  };
}

/**
 * Loads a game from a given key.
 *
 * @export
 * @param {string} gameKey Name of the game.
 * @return {function(function(object):void):void}
 */
export function loadGameFromKey(gameKey) {
  return (dispatch, getState) => {
    const gameObserver = Rx.Observable.fromPromise(
      db.child(`games/${gameKey}`).once('value')
    );

    dispatch(startLoading(`Resuming game ...`));
    const subscription = gameObserver.subscribe(
      (gameSnapshot) => {
        const currentState = getState();

        if (gameSnapshot.exists()) {
          const game = gameSnapshot.val();
          const player = Game.getPlayer(game, currentState.app.player.id);
          const opponent = Game.getOpponent(game, currentState.app.player.id);
          const gamePage = PAGES.GAME.withTitle(`${player.name} vs ${opponent.name}`);

          dispatch(resumeGame(gameKey));
          dispatch(updateGame(game));
          dispatch(startListeningForGameUpdates(gameKey));

          const gameState = getState().game;
          if (gameState.valid) {
            dispatch(pushPage(gamePage));
          } else {
            dispatch(showMessage('Game is not in a valid state!'));
          }
        }
      },
      (error) => dispatch(showMessage(error)),
      () => dispatch(endLoading())
    );
    setSubscription(subscription);
  };
}

export const resumeGame = (game) => ({
  type: GAME_ACTIONS.RESUME_GAME,
  game,
});

export const gameStarted = (game) => ({
  type: GAME_ACTIONS.START_GAME,
  game,
});

/**
 * Starts a new game between the two given players.
 *
 * @export
 * @param {string} playerID Database ID of the player.
 * @param {string} opponentID Database ID of the player's opponent.
 * @param {any} players Map of player IDs to their corresponding player objects.
 * @return {function(function(object):void):void}
 */
export function startGame(playerID, opponentID, players, beginningPlayer = playerID) {
  return (dispatch) => {
    dispatch(startLoading(`starting game against ${players[opponentID].name}`));

    const playersCopy = {};
    for (const id in players) {
      if (players.hasOwnProperty(id)) {
        Object.assign(playersCopy, {
          [id]: {
            name: players[id].name,
          },
        });
      }
    }

    const newGame = {
      players: playersCopy,
      currentPlayer: beginningPlayer,
      moves: [],
    };
    const gameName = Game.getKey(newGame);
    const playerRef = db.child(`players/${playerID}`);
    const opponentRef = db.child(`players/${opponentID}`);
    const gameRef = db.child(`games/${gameName}`);

    return Promise.all([
      opponentRef.once('value'),
      playerRef.once('value'),
      gameRef.once('value'),
    ])
      .then((results) => {
        const opponent = results[0];
        const player = results[1];
        const game = results[2];
        const updatePlayerGames = (gamesObj) => {
          return {
            players: {
              [player.key]: {
                name: player.val().name,
              },
              [opponent.key]: {
                name: opponent.val().name,
              },
            },
            currentPlayer: newGame.currentPlayer,
          };
        };

        if (!opponent.exists()) {
          throw new Error('Opponent does not exist in database!');
        }
        if (!player.exists()) {
          throw new Error('Player does not exist in database!');
        }
        if (game.exists()) {
          throw new Error(`You are already playing against ${opponent.val().name}!`);
        }

        return gameRef
          .set(newGame)
          .then(() =>
            Promise.all([
              db
                .child(`players/${playerID}/games/${gameName}`)
                .transaction(updatePlayerGames),
              db
                .child(`players/${opponentID}/games/${gameName}`)
                .transaction(updatePlayerGames),
            ])
          )
          .then(() => {
            const gamePage = PAGES.GAME.withTitle(
              `${players[playerID].name} vs ${players[opponentID].name}`
            );
            dispatch(gameStarted(newGame));
            dispatch(replacePage(gamePage));
            dispatch(startListeningForGameUpdates(gameName));
            dispatch(endLoading());
          });
      })
      .catch((err) => {
        dispatch(endLoading());
        if (err instanceof Error) {
          dispatch(showMessage(err.message));
        }
      });
  };
}

export const updateGame = (game) => ({
  type: GAME_ACTIONS.UPDATE_GAME,
  game,
});

/**
 * End the game with given key.
 *
 * @export
 * @param {any} gameKey Name of the game that should be ended.
 * @return {function(function(object):void):void}
 */
export function endGame(gameKey) {
  return (dispatch, getState) => {
    const currentState = getState();
    const player = currentState.app.player.id;

    if (currentState.game.isAIGame || currentState.game.isTutorial) {
      dispatch(popPage());
      return;
    }

    const gameRef = db.child(`games/${gameKey}`);
    const playerGameRef = db.child(`players/${player}/games/${gameKey}`);

    // do not receive updates on this game anymore
    gameRef.off();

    gameRef
      .once('value')
      .then((snapshot) => {
        const game = snapshot.val();
        const opponent = Object.keys(game.players).find((uid) => uid !== player);

        // remove game from player
        playerGameRef.remove();

        // if opponent still has game
        return db
          .child(`players/${opponent}/games/${gameKey}`)
          .once('value')
          .then((val) => {
            if (val.exists()) {
              if (game.currentPlayer === player) {
                gameRef.child('currentPlayer').set(opponent);
              }
            } else {
              if (game.currentPlayer === player) {
                gameRef.remove();
              }
            }
          });
      })
      .then(() => {
        dispatch(popPageUntil(PAGES.DASHBOARD));
      })
      .catch((e) => {
        Logger.error('an error occured while ending the game:', e);
        dispatch(popPageUntil(PAGES.DASHBOARD));
      });
  };
}

export const clickOnTower = (tower, playerID) => ({
  type: GAME_ACTIONS.CLICK_ON_TOWER,
  tower,
  playerID,
});

/**
 * Whenever a player clicks onto a field.
 *
 * @export
 * @param {any} field The field the player clicked onto.
 * @return {function(function(object):void):void}
 */
export function clickOnField(field) {
  return (dispatch, getState) => {
    const oldState = getState();
    const playerID = oldState.app.player.id;
    const opponentID = Game.getOpponentID(oldState.game, playerID);
    const currentGame = oldState.app.currentGame;

    dispatch(clickedOnField(field, playerID, currentGame));
    let newState = getState();

    if (
      oldState.game.currentPlayer !== newState.game.currentPlayer ||
      Game.hasEnded(newState.game)
    ) {
      // only save game if it is not a tutorial
      if (!oldState.game.isTutorial && !oldState.game.isAIGame) {
        const game = {
          currentColor: newState.game.currentColor,
          currentPlayer: newState.game.currentPlayer,
          players: newState.game.players,
          moves: newState.game.moves,
        };

        db.child(`games/${currentGame}`).set(game).then(() => {
          return [playerID, opponentID].map((id) => {
            return db
              .child(`players/${id}/games/${currentGame}/currentPlayer`)
              .set(game.currentPlayer);
          });
        });
      }

      if (oldState.game.isAIGame) {
        setTimeout(() => {
          while (
            !Game.hasEnded(newState.game) &&
            newState.game.currentPlayer === 'computer'
          ) {
            const chosenMove = computerPlayer.getNextMove(newState.game);

            if (chosenMove) {
              Logger.info('will choose:', chosenMove);
              dispatch(
                clickedOnField(chosenMove.to, newState.game.currentPlayer, currentGame)
              );
              newState = getState();
            } else {
              Logger.info('Computer has won.');
              break;
            }
          }
        }, 0);
      }
    } else {
      if (newState.game.moveResult === MOVE_RESULTS.NOT_YOUR_TURN) {
        dispatch(showMessage(`It's not your turn.`));
      } else if (newState.game.moveResult === MOVE_RESULTS.INVALID) {
        dispatch(showMessage('Move is not valid.'));
      } else if (newState.game.moveResult === MOVE_RESULTS.NO_TOWER_SELECTED) {
        dispatch(showMessage('Select a tower first.'));
      }
    }
  };
}

export const clickedOnField = (field, playerID, currentGame) => ({
  type: GAME_ACTIONS.CLICK_ON_FIELD,
  field,
  playerID,
  currentGame,
});
