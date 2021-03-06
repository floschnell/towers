import {ACTION_TYPES, AUTH_STATE} from '../actions/index';
import Game from '../models/Game';
import Logger from '../logger';

export default (state, action) => {
  if (typeof state === 'undefined') {
    return {
      usernameValid: false,
      token: null,
      isLoading: false,
      loadingMessage: '',
      players: {},
      games: {},
      requests: {},
      player: null,
      user: null,
      currentGame: null,
      surfaceWidth: 0,
      surfaceHeight: 0,
      surfaceMinSize: 0,
      message: null,
      authState: AUTH_STATE.INITIALIZING,
    };
  }

  const newState = JSON.parse(JSON.stringify(state));

  switch (action.type) {
    case ACTION_TYPES.USERNAME_CHECKED:
      return Object.assign(newState, {
        usernameValid: action.result,
      });

    case ACTION_TYPES.UPDATE_TOKEN:
      return Object.assign(newState, {
        token: action.token,
      });

    case ACTION_TYPES.START_LOADING:
      return Object.assign(newState, {
        isLoading: true,
        loadingMessage: action.message,
      });

    case ACTION_TYPES.END_LOADING:
      return Object.assign(newState, {
        isLoading: false,
      });

    case ACTION_TYPES.CANCEL_LOADING:
      return Object.assign(newState, {
        isLoading: false,
        loadingMessage: null,
      });

    case ACTION_TYPES.UPDATE_GAMES:
      return Object.assign(newState, {
        games: action.games,
      });

    case ACTION_TYPES.AUTHENTICATE:
      return Object.assign(newState, {
        player: action.player,
        authState: AUTH_STATE.AUTHENTICATED,
      });

    case ACTION_TYPES.SET_PLAYER:
      return Object.assign(newState, {
        player: action.player,
      });

    case ACTION_TYPES.AUTHENTICATION_IN_PROGRESS:
      return Object.assign(newState, {
        authState: AUTH_STATE.PENDING,
      });

    case ACTION_TYPES.DEAUTHENTICATE:
      return Object.assign(newState, {
        player: null,
        authState: AUTH_STATE.UNAUTHENTICATED,
      });

    case ACTION_TYPES.SUSPEND_GAME:
      return Object.assign(newState, {
        currentGame: null,
      });

    case ACTION_TYPES.RESUME_GAME:
      return Object.assign(newState, {
        currentGame: action.game,
      });

    case ACTION_TYPES.UPDATE_PLAYERS:
      return Object.assign(newState, {
        searchStr: action.searchStr,
        players: action.players,
      });

    case ACTION_TYPES.START_GAME:
      const gameKey = Game.getKey(action.game);

      return Object.assign(newState, {
        currentGame: gameKey,
        games: Object.assign(newState.games, {
          [gameKey]: action.game,
        }),
      });

    case ACTION_TYPES.RESIZE_GAME_SURFACE:
      if (
        action.surfaceWidth === state.surfaceWidth &&
        action.surfaceHeight === state.surfaceHeight
      ) {
        return state;
      }

      return Object.assign(newState, {
        surfaceWidth: action.surfaceWidth,
        surfaceHeight: action.surfaceHeight,
        surfaceSize: action.surfaceWidth < action.surfaceHeight
          ? action.surfaceWidth
          : action.surfaceHeight,
      });

    case ACTION_TYPES.SHOW_MESSAGE:
      Logger.debug('setting message', action.message);
      return Object.assign(newState, {
        message: action.message,
      });

    case ACTION_TYPES.CLEAR_MESSAGE:
      Logger.debug('clear message', newState.message);
      return Object.assign(newState, {
        message: null,
      });

    case ACTION_TYPES.UPDATE_REQUESTS:
      Logger.debug('new requests', action.requests);
      return Object.assign(newState, {
        requests: action.requests,
      });

    default:
      return newState;
  }
};
