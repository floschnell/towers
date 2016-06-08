import {ACTION_TYPES} from '../actions/index';

export default (state, action) => {
    
    if (typeof state === 'undefined') {
        return {
            players: [],
            games: {},
            playerName: null,
            currentGame: null,
            surfaceWidth: 0,
            surfaceHeight: 0,
            surfaceMinSize: 0
        };
    }
    
    switch (action.type) {
        case ACTION_TYPES.UPDATE_GAMES:
            return Object.assign(state, {
                games: action.games
            });
            
        case ACTION_TYPES.SET_PLAYER_NAME:
            return Object.assign(state, {
                playerName: action.playerName
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
            return Object.assign(state, {
                currentGame: action.game
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