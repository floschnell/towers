import app from './app';
import game from './game';
import navigation from './navigation';
import { combineReducers } from 'redux';

export default combineReducers({ app, game, navigation });
