import Game from '../models/Game';

export const GAME_ACTIONS = {
  UPDATE_GAMES: 'UPDATE_GAMES',
  RESUME_GAME: 'RESUME_GAME',
  START_GAME: 'START_GAME',
  UPDATE_GAME: 'UPDATE_GAME',
  SUSPEND_GAME: 'SUSPEND_GAME',
  GAME_ENDED: 'GAME_ENDED',
};

export const MOVE_RESULTS = {
  OK: 'OK',
  NOT_YOUR_TURN: 'NOT_YOUR_TURN',
  INVALID: 'INVALID',
  NO_TOWER_SELECTED: 'NO_TOWER_SELECTED',
};

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
  return (dispatch) => {
    Logger.debug(`suspending game: ${gameKey}`);
    db.child(`games/${gameKey}`).off();
    dispatch(gameSuspended());
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
    subscription = gameObserver.subscribe(
      (gameSnapshot) => {
        const currentState = getState();

        if (gameSnapshot.exists()) {
          const game = gameSnapshot.val();
          const player = Game.getPlayer(game, currentState.app.player.id);
          const opponent = Game.getOpponent(game, currentState.app.player.id);
          const gamePage = PAGES.GAME.withTitle(
            `${player.name} vs ${opponent.name}`
          );

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
      (error) => dispatch(showMessage(e)),
      () => dispatch(endLoading())
    );
  };
}

export const resumeGame = (game) => ({
  type: ACTION_TYPES.RESUME_GAME,
  game,
});

export const gameStarted = (game) => ({
  type: ACTION_TYPES.START_GAME,
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
export function startGame(playerID, opponentID, players) {
  return (dispatch) => {
    dispatch(
      startLoading(`starting game against ${players[opponentID].name}`)
    );

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
      currentPlayer: playerID,
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
          gamesObj = gamesObj || {};
          gamesObj[gameName] = {
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
          return gamesObj;
        };

        if (!opponent.exists()) {
          throw 'Opponent does not exist in database!';
        }
        if (!player.exists()) {
          throw 'Player does not exist in database!';
        }
        if (game.exists()) {
          throw `You are already playing against ${opponent.val().name}!`;
        }

        return gameRef
          .set(newGame)
          .then(() =>
            Promise.all([
              db
                .child(`players/${playerID}/games`)
                .transaction(updatePlayerGames),
              db
                .child(`players/${opponentID}/games`)
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
        dispatch(showMessage(err));
      });
  };
}

export const updateGame = (game) => ({
  type: ACTION_TYPES.UPDATE_GAME,
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
        const opponent = Object.keys(game.players).find(
          (uid) => uid !== player
        );

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
        dispatch(gameEnded(gameKey));
      })
      .catch((e) => {
        Logger.error('an error occured while ending the game:', e);
      })
      .then(() => dispatch(popPage()));
  };
}

export const gameEnded = (gameKey, player) => ({
  type: ACTION_TYPES.GAME_ENDED,
  gameKey,
});

export const clickOnTower = (tower, playerID) => ({
  type: ACTION_TYPES.CLICK_ON_TOWER,
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

    if (oldState.game.currentPlayer !== newState.game.currentPlayer) {
      // only save game if it is not a tutorial
      if (!oldState.game.isTutorial && !oldState.game.isAIGame) {
        const game = {
          currentColor: newState.game.currentColor,
          currentPlayer: newState.game.currentPlayer,
          players: newState.game.players,
          moves: newState.game.moves,
        };

        db.child(`games/${currentGame}`).update(game).then(() => {
          return [playerID, opponentID].map((id) => {
            return db
              .child(`players/${id}/games/${currentGame}/currentPlayer`)
              .set(game.currentPlayer);
          });
        });
      }

      if (oldState.game.isAIGame) {
        while (newState.game.currentPlayer === 'computer') {
          const computerPlayer = new AI(
            newState.game,
            newState.app.player.id,
            ewState.game.ai
          );
          const chosenMove = computerPlayer.getNextMove();

          if (chosenMove) {
            Logger.info('will choose:', chosenMove);
            dispatch(
              clickedOnField(
                chosenMove.to,
                newState.game.currentPlayer,
                currentGame
              )
            );
            newState = getState();
          } else {
            Logger.info('Computer has won.');
            break;
          }
        }
      }
    } else {
      if (newState.game.moveResult === MOVE_RESULTS.NOT_YOUR_TURN) {
        dispatch(showMessage(`It's not your turn.`));
      } else if (newState.game.moveResult === MOVE_RESULTS.INVALID) {
        dispatch(showMessage('Move is not valid.'));
      } else if (
        newState.game.moveResult === MOVE_RESULTS.NO_TOWER_SELECTED
      ) {
        dispatch(showMessage('Select a tower first.'));
      }
    }
  };
}

export const clickedOnField = (field, playerID, currentGame) => ({
  type: ACTION_TYPES.CLICK_ON_FIELD,
  field,
  playerID,
  currentGame,
});
