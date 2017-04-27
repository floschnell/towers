import {APP_ACTIONS} from './app';
import {GAME_ACTIONS} from './game';
import {NAVIGATION_ACTIONS} from './navigation';

export * from './app';
export * from './game';
export * from './navigation';

export const ACTION_TYPES = {
  APP: APP_ACTIONS,
  GAME: GAME_ACTIONS,
  NAVIGATION: NAVIGATION_ACTIONS,
};
