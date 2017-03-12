import {ACTION_TYPES} from '../actions/index';
import {getGameKey} from './game';
import { PAGES } from '../models/Page';

export default (state, action) => {
    
    if (typeof state === 'undefined') {
        return {
            isLoading: false,
            loadingMessage: '',
            players: [],
            games: {},
            player: null,
            user: null,
            currentGame: null,
            surfaceWidth: 0,
            surfaceHeight: 0,
            surfaceMinSize: 0,
            currentPage: PAGES.LOGIN
        };
    }
    
    switch (action.type) {
        case ACTION_TYPES.GO_TO_PAGE:
         return Object.assign(state, {
             currentPage: action.page
            });

        case ACTION_TYPES.START_LOADING:
           return Object.assign(state, {
                isLoading: true,
                loadingMessage: action.message
            });

        case ACTION_TYPES.END_LOADING:
           return Object.assign(state, {
                isLoading: false
            }); 

        case ACTION_TYPES.UPDATE_GAMES:
            return Object.assign(state, {
                games: action.games
            });
            
        case ACTION_TYPES.SET_PLAYER:
            const test = Object.assign(state, {
                player: action.player,
                user: action.user
            });
            console.log('new app state:', test);
            return test;
            
        case ACTION_TYPES.RESUME_GAME:
            return Object.assign(state, {
                currentGame: action.game
            });
            
        case ACTION_TYPES.UPDATE_PLAYERS:
            return Object.assign(state, {
                searchStr: action.searchStr,
                players: action.players
            });
            
        case ACTION_TYPES.START_GAME:
            const gameKey = getGameKey(action.game);

            return Object.assign(state, {
                currentGame: gameKey,
                games: Object.assign(state.games, {
                    [gameKey]: action.game
                })
            });
            
        case ACTION_TYPES.RESIZE_GAME_SURFACE:
            return Object.assign(state, {
                surfaceWidth: action.surfaceWidth,
                surfaceHeight: action.surfaceHeight,
                surfaceSize: (action.surfaceWidth < action.surfaceHeight) ? action.surfaceWidth : action.surfaceHeight 
            });
            
        default:
            return state;
    }
};