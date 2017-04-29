import {APP_ACTIONS} from './app';
import {GAME_ACTIONS} from './game';
import {NAVIGATION_ACTIONS} from './navigation';

export * from './app';
export * from './game';
export * from './navigation';

export const ACTION_TYPES = Object.assign(
  {},
  APP_ACTIONS,
  GAME_ACTIONS,
  NAVIGATION_ACTIONS
);
