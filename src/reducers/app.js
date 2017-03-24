import { ACTION_TYPES } from '../actions/index';
import { getGameKey } from './game';
import { PAGES } from '../models/Page';

export default (state, action) => {
    
    if (typeof state === 'undefined') {
        return {
            usernameValid: false,
            token: null,
            isLoading: false,
            loadingMessage: '',
            loadingOrderID: 0,
            players: [],
            games: {},
            player: null,
            user: null,
            currentGame: null,
            surfaceWidth: 0,
            surfaceHeight: 0,
            surfaceMinSize: 0,
            message: null,
            pageStack: [PAGES.LOGIN]
        };
    }
    
    switch (action.type) {

        case ACTION_TYPES.USERNAME_CHECKED:
            return Object.assign(state, {
                usernameValid: action.result
            }); 

        case ACTION_TYPES.UPDATE_TOKEN:
            return Object.assign(state, {
                token: action.token
            });

        case ACTION_TYPES.PUSH_PAGE:
            console.log('setting page stack to: ', state.pageStack.concat(action.page));
            return Object.assign(state, {
                pageStack: state.pageStack.concat(action.page)
            });

        case ACTION_TYPES.POP_PAGE:
            console.log('setting page stack to: ', state.pageStack.slice(0, state.pageStack.length - 1));
            return Object.assign(state, {
                pageStack: state.pageStack.slice(0, state.pageStack.length - 1)
            });

        case ACTION_TYPES.POP_UNTIL_PAGE:
            const newStack = [];
            for (page of state.pageStack) {
                newStack.push(page);
                if (action.page.equals(page)) {
                    break;
                }
            }
            return Object.assign(state, {
                pageStack: newStack
            });

        case ACTION_TYPES.REPLACE_PAGE:
            console.log('setting page stack to: ', state.pageStack.slice(0, state.pageStack.length - 1).concat(action.page));
            return Object.assign(state, {
                pageStack: state.pageStack.slice(0, state.pageStack.length - 1).concat(action.page)
            });

        case ACTION_TYPES.INIT_PAGE:
            return Object.assign(state, {
                pageStack: [action.page]
            });

        case ACTION_TYPES.START_LOADING:
           return Object.assign(state, {
                isLoading: true,
                loadingMessage: action.message,
                loadingOrderID: action.orderID
            });

        case ACTION_TYPES.END_LOADING:
           return Object.assign(state, {
                isLoading: false
            });

        case ACTION_TYPES.CANCEL_LOADING:
            return Object.assign(state, {
                isLoading: false,
                loadingMessage: null
            });

        case ACTION_TYPES.UPDATE_GAMES:
            return Object.assign(state, {
                games: action.games
            });
            
        case ACTION_TYPES.SET_PLAYER:
            const test = Object.assign(state, {
                player: action.player
            });
            console.debug('new app state:', test);
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

        case ACTION_TYPES.SHOW_MESSAGE:
            return Object.assign(state, {
                message: action.message
            });

        case ACTION_TYPES.CLEAR_MESSAGE:
            delete state.message;
            return state;
            
        default:
            return state;
    }
};