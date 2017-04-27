import db from '../database';
import firebase from 'firebase';
import {PAGES} from '../models/Page';
import Rx from 'rxjs';
import Logger from '../logger';

/**
 * Any asynchronous task that is running in background and that can be canceled.
 *
 * @type {Rx.Subscription}
 */
let subscription = null;

/**
 * All the different actions this application consists of.
 */
export const ACTION_TYPES = {
  UPDATE_TOKEN: 'UPDATE_TOKEN',
  START_LOADING: 'START_LOADING',
  END_LOADING: 'END_LOADING',
  CLICK_ON_TOWER: 'CLICK_ON_TOWER',
  CLICK_ON_FIELD: 'CLICK_ON_FIELD',
  USERNAME_CHECKED: 'USERNAME_CHECKED',
  AUTHENTICATE: 'AUTHENTICATE',
  AUTHENTICATION_IN_PROGRESS: 'AUTHENTICATION_IN_PROGRESS',
  DEAUTHENTICATE: 'DEAUTHENTICATE',
  START_SEARCH_FOR_PLAYERS: 'START_SEARCH_FOR_PLAYERS',
  UPDATE_PLAYERS: 'UPDATE_PLAYERS',
  RESIZE_GAME_SURFACE: 'RESIZE_GAME_SURFACE',
  SHOW_MESSAGE: 'SHOW_MESSAGE',
  CLEAR_MESSAGE: 'CLEAR_MESSAGE',
  CANCEL_LOADING: 'CANCEL_LOADING',
  LAUNCH_TUTORIAL: 'LAUNCH_TUTORIAL',
  NEXT_TUTORIAL_STEP: 'NEXT_TUTORIAL_STEP',
  LAUNCH_GAME_AGAINST_AI: 'LAUNCH_GAME_AGAINST_AI',
};

export const AUTH_STATE = {
  INITIALIZING: 'INITIALIZING',
  PENDING: 'PENDING',
  AUTHENTICATED: 'AUTHENTICATED',
  UNAUTHENTICATED: 'UNAUTHENTICATED',
};

export const MOVE_RESULTS = {
  OK: 'OK',
  NOT_YOUR_TURN: 'NOT_YOUR_TURN',
  INVALID: 'INVALID',
  NO_TOWER_SELECTED: 'NO_TOWER_SELECTED',
};

export const launchTutorial = (player) => ({
  type: ACTION_TYPES.LAUNCH_TUTORIAL,
  player,
});

export function launchGameAgainstAI(player) {
  const aiCharacteristics = {
    blockedPenalty: 20 + (5 - Math.random() * 10),
    couldFinishBonus: 10 + (2 - Math.random() * 4),
    aggressiveness: 0.5 + (0.1 - Math.random() * 0.2),
  };

  return {
    type: ACTION_TYPES.LAUNCH_GAME_AGAINST_AI,
    player,
    blockedPenalty: aiCharacteristics.blockedPenalty,
    couldFinishBonus: aiCharacteristics.couldFinishBonus,
    aggressiveness: aiCharacteristics.aggressiveness,
  };
}

export const nextTutorialStep = () => ({
  type: ACTION_TYPES.NEXT_TUTORIAL_STEP,
});

export function checkUsername(playerName) {
  return (dispatch) => {
    const playerID = playerName.toLowerCase();

    Rx.Observable
      .fromPromise(db.child(`players/${playerID}`).once('value'))
      .subscribe();

    db.child(`players/${playerID}`).once('value').then((playerSnapshot) => {
      dispatch(usernameChecked(!playerSnapshot.exists()));
    });
  };
}

export function updateToken(token) {
  return (dispatch, getState) => {
    const state = getState();

    if (state.app.player && state.app.player.id) {
      db.child(`players/${state.app.player.id}/token`).set(token).then(() => {
        Logger.debug('set app token on player.');
      });
    }
    dispatch(setToken(token));
  };
}

const setToken = (token) => ({
  type: ACTION_TYPES.UPDATE_TOKEN,
  token,
});

export function usernameChecked(result) {
  return {
    type: ACTION_TYPES.USERNAME_CHECKED,
    result,
  };
}

export function cancelLoading() {
  if (subscription) {
    Logger.debug('cancel subscription to:', subscription);
    subscription.unsubscribe();
  }
  return {
    type: ACTION_TYPES.CANCEL_LOADING,
  };
}

export const showMessage = (message) => ({
  type: ACTION_TYPES.SHOW_MESSAGE,
  message,
});

export const clearMessage = () => ({
  type: ACTION_TYPES.CLEAR_MESSAGE,
});

export function logout() {
  return (dispatch) => {
    dispatch(initializeWithPage(PAGES.LOGIN.withTitle('Welcome to Towers')));
    firebase
      .auth()
      .signOut()
      .then(() => {
        dispatch(deauthenticate());
      })
      .catch((e) => {
        Logger.error('Could not log out user, because: ', e);
      });
  };
}

export function login(id, password) {
  return (dispatch, getState) => {
    const player = Rx.Observable.fromPromise(
      db.child(`players/${id.toLowerCase()}`).once('value')
    );
    dispatch(authenticationInProgress());

    player.subscribe(
      (playerSnapshot) => {
        if (!playerSnapshot.exists()) {
          throw 'This player does not exist!';
        }

        firebase
          .auth()
          .signInWithEmailAndPassword(playerSnapshot.val().mail, password)
          .catch((error) => {
            throw error.message;
          });
      },
      (error) => {
        dispatch(deauthenticate());
        dispatch(showMessage(error));
      }
    );
  };
}

export function startListeningForGamelistUpdates(playerID) {
  return (dispatch) => {
    const playerGamesRef = db.child(`players/${playerID}/games`);

    playerGamesRef.on('value', (snapshot) => {
      const games = snapshot.val() || {};
      dispatch(updateGames(games));
    });
  };
}

export function stopListeningForGamelistUpdates(playerID) {
  return (dispatch) => {
    const playerGamesRef = db.child(`players/${playerID}/games`);

    playerGamesRef.off('value');
  };
}

export function createAccount(username, email, password) {
  return (dispatch) => {
    const playerID = username.toLowerCase();
    const playerObj = {
      name: username,
      mail: email,
    };

    dispatch(startLoading(`Creating account ${username}`));

    db
      .child(`players/${playerID}`)
      .once('value')
      .then((snapshot) => {
        return !snapshot.exists();
      })
      .then((valid) => {
        if (valid) {
          return firebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .then((user) => {
              const playerRef = db.child(`players/${playerID}`);
              playerObj.uid = user.uid;

              return playerRef.set(playerObj);
            })
            .then((playerSnapshot) => {
              dispatch(setPlayer(playerObj));
            });
        } else {
          alert('Username is already taken.');
          return Promise.resolve();
        }
      })
      .catch((error) => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        alert(`Unknown error: ${errorCode} ${errorMessage}`);
      })
      .then(() => {
        dispatch(endLoading());
      });
  };
}

export function startLoading(message) {
  return {
    type: ACTION_TYPES.START_LOADING,
    message,
  };
}

export function endLoading() {
  return {
    type: ACTION_TYPES.END_LOADING,
  };
}

export const authenticate = (player) => ({
  type: ACTION_TYPES.AUTHENTICATE,
  player,
});

export const deauthenticate = () => ({
  type: ACTION_TYPES.DEAUTHENTICATE,
});

export const authenticationInProgress = () => ({
  type: ACTION_TYPES.AUTHENTICATION_IN_PROGRESS,
});

export const updateGames = (games) => ({
  type: ACTION_TYPES.UPDATE_GAMES,
  games,
});

export function waitForLogin() {
  return (dispatch, getState) => {
    const state = getState();

    firebase.auth().onAuthStateChanged((user) => {
      Logger.debug('auth change: ', user);
      if (user) {
        dispatch(authenticationInProgress());
        db
          .child('players')
          .orderByChild('uid')
          .equalTo(user.uid)
          .once('value')
          .then((playersSnapshot) => {
            if (!playersSnapshot.exists()) {
              throw 'Player does not exist!';
            }

            const matchingPlayers = Object.keys(playersSnapshot.val());
            if (matchingPlayers.length > 1) {
              throw 'There exists more than one player with that UID!';
            }
            const playerID = matchingPlayers[0];
            const player = Object.assign(playersSnapshot.val()[playerID], {
              id: playerID,
            });
            Logger.debug('setting user: ', player);
            dispatch(authenticate(player));
            dispatch(
              pushPage(PAGES.DASHBOARD.withTitle(`Playing as ${player.name}`))
            );
            Logger.debug('you got logged in');
          })
          .catch((e) => {
            dispatch(deauthenticate());
            firebase.auth().signOut();
            dispatch(showMessage('Could not log you in.'));
          });
      } else {
        dispatch(deauthenticate());
      }
    });
  };
}

export function searchForPlayers(searchStr) {
  return (dispatch) => {
    const searchStart = searchStr.toLowerCase();
    const searchEnd = `${searchStart}\uf8ff`;

    db
      .child('players')
      .orderByKey()
      .startAt(searchStart)
      .endAt(searchEnd)
      .once('value')
      .then((snapshot) => {
        if (snapshot.exists()) {
          dispatch(updatePlayers(searchStr, snapshot.val()));
        } else {
          dispatch(updatePlayers(searchStr, []));
        }
      });
  };
}

export const startSearchForPlayers = (searchStr) => ({
  type: ACTION_TYPES.START_SEARCH_FOR_PLAYERS,
  searchStr,
});

export const updatePlayers = (searchStr, players) => ({
  type: ACTION_TYPES.UPDATE_PLAYERS,
  players,
});

export const resizeGameSurface = (width, height) => ({
  type: ACTION_TYPES.RESIZE_GAME_SURFACE,
  surfaceWidth: width,
  surfaceHeight: height,
});
