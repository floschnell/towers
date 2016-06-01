import {ACTION_TYPES} from '../actions/index';

export default (state, action) => {
    
    if (typeof state === 'undefined') {
        return {
            players: [],
            games: {},
            playerName: null,
            currentGame: null
        };
    }
    
    switch (action.type) {
        case ACTION_TYPES.UPDATE_GAMES:
            const gamesCopy = JSON.parse(JSON.stringify(state.games));
            gamesCopy[action.game] = action.details;
            return {
                searchStr: state.searchStr,
                players: state.players,
                games: gamesCopy,
                playerName: state.playerName,
                currentGame: state.currentGame
            };
            
        case ACTION_TYPES.SET_PLAYER_NAME:
            return {
                searchStr: state.searchStr,
                players: state.players,
                games: state.games,
                playerName: action.playerName,
                currentGame: state.currentGame
            };
            
        case ACTION_TYPES.RESUME_GAME:
            return {
                searchStr: state.searchStr,
                players: state.players,
                games: state.games,
                playerName: state.playerName,
                currentGame: action.game
            };
            
        case ACTION_TYPES.UPDATE_PLAYERS:
            return {
                searchStr: action.searchStr,
                players: action.players,
                games: state.games,
                playerName: state.playerName,
                currentGame: state.currentGame
            };
            
        case ACTION_TYPES.START_GAME:
            return {
                searchStr: state.searchStr,
                players: state.players,
                games: state.games,
                playerName: state.playerName,
                currentGame: action.game
            };
            
        default:
            return state;
    }
};