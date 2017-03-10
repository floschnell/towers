import {ACTION_TYPES} from '../actions/index';
import {getGameKey} from './game';

export default (state, action) => {
    
    if (typeof state === 'undefined') {
        return {
            isLoading: false,
            players: [],
            games: {},
            player: null,
            user: null,
            currentGame: null,
            surfaceWidth: 0,
            surfaceHeight: 0,
            surfaceMinSize: 0
        };
    }
    
    switch (action.type) {

        case ACTION_TYPES.START_LOADING:
           return Object.assign(state, {
                isLoading: true
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
            return Object.assign(state, {
                player: action.player,
                user: action.user
            });
            
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