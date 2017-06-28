import db from '../database';
import firebase from 'firebase';
import {PAGES} from '../models/Page';
import {initializeWithPage} from '../actions/navigation';
import Rx from 'rxjs';
import Logger from '../logger';

/**
 * Any asynchronous task that is running in background and that can be canceled.
 *
 * @type {Rx.Subscription}
 */
export let subscription = null;

export const setSubscription = (inSubscription) => {
  subscription = inSubscription;
};

export const getSubscription = () => {
  return subscription;
};

/**
 * All the different actions this application consists of.
 */
export const APP_ACTIONS = {
  UPDATE_TOKEN: 'UPDATE_TOKEN',
  START_LOADING: 'START_LOADING',
  END_LOADING: 'END_LOADING',
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
  UPDATE_GAMES: 'UPDATE_GAMES',
  SET_PLAYER: 'SET_PLAYER',
};

export const AUTH_STATE = {
  INITIALIZING: 'INITIALIZING',
  PENDING: 'PENDING',
  AUTHENTICATED: 'AUTHENTICATED',
  UNAUTHENTICATED: 'UNAUTHENTICATED',
};

export const launchTutorial = () => ({
  type: APP_ACTIONS.LAUNCH_TUTORIAL,
});

export const nextTutorialStep = () => ({
  type: APP_ACTIONS.NEXT_TUTORIAL_STEP,
});

/**
 * Check whether a certain user name is correct and
 * does not exist in the database.
 *
 * @param {string} playerName Player name that should be checked.
 * @return {void}
 */
export function checkUsername(playerName) {
  return (dispatch) => {
    const playerID = playerName.toLowerCase();

    if (playerID.length < 3) {
      dispatch(usernameChecked(false));
      return;
    }

    if (playerID.match(/[.$\[\]#\/]/)) {
      dispatch(usernameChecked(false));
      return;
    }

    Rx.Observable
      .fromPromise(db.child(`players/${playerID}`).once('value'))
      .subscribe();

    db.child(`players/${playerID}`).once('value').then((playerSnapshot) => {
      dispatch(usernameChecked(!playerSnapshot.exists()));
    });
  };
}

/**
 * Updates the token for the current user's device.
 *
 * @param {string} token The user device's token.
 * @return {void}
 */
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
  type: APP_ACTIONS.UPDATE_TOKEN,
  token,
});

/**
 * Set the result of the username check.
 *
 * @param {boolean} result Whether the entered username is valid.
 * @return {void}
 */
export function usernameChecked(result) {
  return {
    type: APP_ACTIONS.USERNAME_CHECKED,
    result,
  };
}

/**
 * Aborts the current loading operation.
 *
 * @return {void}
 */
export function cancelLoading() {
  if (subscription) {
    Logger.debug('cancel subscription to:', subscription);
    subscription.unsubscribe();
  }
  return {
    type: APP_ACTIONS.CANCEL_LOADING,
  };
}

export const showMessage = (message) => ({
  type: APP_ACTIONS.SHOW_MESSAGE,
  message,
});

export const clearMessage = () => ({
  type: APP_ACTIONS.CLEAR_MESSAGE,
});

/**
 * Logs out the current user.
 *
 * @return {void}
 */
export function logout() {
  return (dispatch) => {
    dispatch(initializeWithPage(PAGES.LOGIN));
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

/**
 * Logs in a new user.
 *
 * @param {string} id Name of the user.
 * @param {string} password Password that matches the user name.
 * @return {void}
 */
export function login(id, password) {
  return (dispatch, getState) => {
    dispatch(startLoading('Login in progress'));
    dispatch(authenticationInProgress());

    db
      .child(`players/${id.toLowerCase()}`)
      .once('value')
      .then((playerSnapshot) => {
        if (!playerSnapshot.exists()) {
          throw new Error('This player does not exist!');
        }

        return firebase
          .auth()
          .signInWithEmailAndPassword(playerSnapshot.val().mail, password);
      })
      .catch((error) => {
        dispatch(deauthenticate());
        dispatch(endLoading());
        dispatch(showMessage(error.message));
      });
  };
}

/**
 * Listen for a player's currently running games.
 *
 * @param {string} playerID User name of the player.
 * @return {void}
 */
export function startListeningForGamelistUpdates(playerID) {
  return (dispatch) => {
    const playerGamesRef = db.child(`players/${playerID}/games`);

    playerGamesRef.on('value', (snapshot) => {
      const games = snapshot.val() || {};
      dispatch(updateGames(games));
    });
  };
}

/**
 * Stop receiving updates on the player's running games.
 *
 * @param {string} playerID User name of the player.
 * @return {void}
 */
export function stopListeningForGamelistUpdates(playerID) {
  return (dispatch) => {
    const playerGamesRef = db.child(`players/${playerID}/games`);

    playerGamesRef.off('value');
  };
}

/**
 * Creates a new player within the database and authenticates
 * him right away.
 *
 * @param {string} username Name of the new player.
 * @param {string} email Mail address of the new player.
 * @param {string} password Passwort of the new player's account.
 * @return {void}
 */
export function createAccount(username, email, password) {
  return (dispatch) => {
    const playerID = username.toLowerCase();

    dispatch(startLoading(`Creating account ${username}`));

    db
      .child(`players/${playerID}`)
      .once('value')
      .then((player) => {
        if (player.exists()) {
          throw new Error('Username has already been taken!');
        }

        dispatch(
          setPlayer({
            name: username,
            mail: email,
          })
        );
        return firebase.auth().createUserWithEmailAndPassword(email, password);
      })
      .catch((error) => {
        alert(error.message);
        dispatch(endLoading());
      });
  };
}

/**
 * Indicate loading and show a message during the process.
 *
 * @param {string} message Message to show while loading is in progress.
 * @return {void}
 */
export function startLoading(message) {
  return {
    type: APP_ACTIONS.START_LOADING,
    message,
  };
}

/**
 * Hide message and indicate that loading has finished.
 *
 * @return {void}
 */
export function endLoading() {
  return {
    type: APP_ACTIONS.END_LOADING,
  };
}

export const setPlayer = (player) => ({
  type: APP_ACTIONS.SET_PLAYER,
  player,
});

export const authenticate = (player) => ({
  type: APP_ACTIONS.AUTHENTICATE,
  player,
});

export const deauthenticate = () => ({
  type: APP_ACTIONS.DEAUTHENTICATE,
});

export const authenticationInProgress = () => ({
  type: APP_ACTIONS.AUTHENTICATION_IN_PROGRESS,
});

export const updateGames = (games) => ({
  type: APP_ACTIONS.UPDATE_GAMES,
  games,
});

/**
 * Handles changes in the authentication state.
 * For instance, when a user logs out or in.
 *
 * @return {void}
 */
export function waitForLogin() {
  return (dispatch, getState) => {
    firebase.auth().onAuthStateChanged((user) => {
      Logger.debug('auth change: ', user);
      if (user) {
        dispatch(startLoading(`Login in progress ...`));
        const authRef = db.child(`authentication/${user.uid}`);
        dispatch(authenticationInProgress());

        authRef
          .once('value')
          .then((authenticationSnapshot) => {
            if (!authenticationSnapshot.exists()) {
              const playerObj = getState().app.player;
              const playerID = playerObj.name.toLowerCase();

              Logger.debug(`User ${user.uid} does not exist yet ...`);
              return db
                .child(`players/${playerID}`)
                .set(Object.assign(playerObj, {uid: user.uid}))
                .then(() => {
                  return authRef.set(playerID);
                })
                .then(() => {
                  return authRef.once('value');
                });
            } else {
              return authenticationSnapshot;
            }
          })
          .then((authenticationSnapshot) => {
            const playerID = authenticationSnapshot.val();

            return db
              .child(`players/${playerID}`)
              .once('value')
              .then((playerSnapshot) => {
                if (!playerSnapshot.exists()) {
                  throw new Error('Player does not exist!');
                }

                const player = Object.assign(playerSnapshot.val(), {
                  id: playerID,
                });
                Logger.debug('setting user: ', player);
                dispatch(authenticate(player));
              });
          })
          .then(() => {
            dispatch(endLoading());
            Logger.debug('you got logged in');
          })
          .catch((e) => {
            Logger.debug('error occured during login:', e.message);
            firebase.auth().signOut();
            dispatch(deauthenticate());
            dispatch(endLoading());
            dispatch(showMessage('Could not log you in.'));
          });
      } else {
        dispatch(deauthenticate());
      }
    });
  };
}

/**
 * Search for players within our database.
 *
 * @param {string} searchStr Search expression to use.
 * @return {void}
 */
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
  type: APP_ACTIONS.START_SEARCH_FOR_PLAYERS,
  searchStr,
});

export const updatePlayers = (searchStr, players) => ({
  type: APP_ACTIONS.UPDATE_PLAYERS,
  players,
});

export const resizeGameSurface = (width, height) => ({
  type: APP_ACTIONS.RESIZE_GAME_SURFACE,
  surfaceWidth: width,
  surfaceHeight: height,
});
