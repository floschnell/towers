import { ACTION_TYPES, MOVE_RESULTS } from '../actions/index';
import GameLogic, { copyTowers, towerPositionsAreEqual } from '../gamelogic';
import Game from '../models/Game';
import { getColor } from '../utils';
import { nextTutorialState, TUTORIAL_MESSAGE_POSITION } from '../tutorial';
import { rateMoves } from '../ai';

export default (state, action) => {
    
    if (typeof(state) === "undefined") {
        const initialPlayers = { "0": {}, "1": {} };

        return {
            board: Game.createInitialBoard(),
            players: initialPlayers,
            currentPlayer: null,
            currentColor: null,
            selectedTower: null,
            moves: [],
            towerPositions: Game.createInitialTowerPositions(Object.keys(initialPlayers)),
            valid: true,
            moveResult: MOVE_RESULTS.OK,
            isTutorial: false,
            isAIGame: false,
            tutorial: {
                step: 0,
                message: '',
                messagePosition: TUTORIAL_MESSAGE_POSITION.BOARD_EDGE,
                continueOnFieldClick: false,
                continueOnMessageClick: false,
                continueOnTowerClick: false,
            }
        };
    }
    
    const newState = JSON.parse(JSON.stringify(state));
    const currentPlayer = state.currentPlayer;
    const currentColor = state.currentColor;
    
    switch (action.type) {

        case ACTION_TYPES.LAUNCH_GAME_AGAINST_AI:
            const aiGamePlayers = {
                computer: {
                    name: 'Computer'
                },
                [action.player.id]: action.player
            };
            const aiGameTowers = Game.createInitialTowerPositions(Object.keys(aiGamePlayers));
            const aiGameBoard = Game.createInitialBoard();

            Object.assign(newState, {
                selectedTower: undefined,
                currentColor: undefined,
                moves: [],
                board: aiGameBoard,
                players: aiGamePlayers,
                currentPlayer: action.player.id,
                towerPositions: aiGameTowers,
                valid: true,
                isAIGame: true,
                isTutorial: false
            });
            return newState;

        case ACTION_TYPES.NEXT_TUTORIAL_STEP:
            console.debug('tutorial click on message');
            nextTutorialState(newState);
            return newState;

        case ACTION_TYPES.LAUNCH_TUTORIAL:
            const players = {
                computer: {
                    name: 'Computer'
                },
                [action.player.id]: action.player
            };
            const towerPositions = Game.createInitialTowerPositions(Object.keys(players));
            const board = Game.createInitialBoard();

            Object.assign(newState, {
                selectedTower: undefined,
                currentColor: undefined,
                moves: [],
                board,
                players,
                currentPlayer: action.player.id,
                towerPositions,
                valid: true,
                isTutorial: true,
                tutorial: {
                    step: 0
                }
            });
            nextTutorialState(newState);
            return newState;

        case ACTION_TYPES.CLICK_ON_TOWER:
            if (currentPlayer === action.playerID) {
                if (state.isTutorial && state.tutorial.continueOnTowerClick) {
                    console.debug('tutorial click on tower');
                    nextTutorialState(newState);
                }

                const towerOnField = action.tower;
                if (typeof state.currentColor === 'undefined' || state.currentColor === null || towerOnField.color === state.currentColor) {
                    newState.selectedTower = action.tower;
                }
            }
            break;
        
        case ACTION_TYPES.CLICK_ON_FIELD:
            if (currentPlayer === action.playerID) {
                let towerToMove = null;
                const targetField = action.field;

                if (typeof currentColor === 'undefined') {
                    towerToMove = state.selectedTower;
                } else {
                    towerToMove = state.towerPositions[currentPlayer][currentColor];
                }
                
                if (towerToMove && towerToMove.belongsToPlayer === currentPlayer) {
                    const move = {
                        player: currentPlayer,
                        color: towerToMove.color,
                        sourceField: towerToMove,
                        targetField
                    };

                    try {
                        newState.towerPositions = GameLogic.executeMove(state.towerPositions, move);
                        const nextPlayer = Game.getOpponentUID(state, currentPlayer);
                        const nextColor = targetField.color;

                        if (GameLogic.canMove(newState.towerPositions, nextPlayer, nextColor)) {
                            newState.currentPlayer = nextPlayer;
                            newState.currentColor = nextColor;
                        } else {
                            const blockedTower = newState.towerPositions[nextPlayer][targetField.color];
                            const fieldOfBlockedTower = newState.board[blockedTower.y][blockedTower.x];

                            newState.currentColor = fieldOfBlockedTower.color;
                        }
                        newState.selectedTower = null;
                        if (!newState.moves) newState.moves = [];
                        newState.moves.push(move);

                        if (state.isTutorial && state.tutorial.continueOnFieldClick) {
                            console.debug('tutorial click on field');
                            nextTutorialState(newState);
                        }

                    } catch (e) {
                        console.debug('move is invalid: ', e);
                        newState.moveResult = MOVE_RESULTS.INVALID;
                        newState.currentPlayer = currentPlayer;
                        if (currentColor) {
                            newState.currentColor = currentColor;
                        }
                        newState.selectedTower = towerToMove;
                        newState.towerPositions = copyTowers(state.towerPositions);
                    }
                } else {
                    newState.moveResult = MOVE_RESULTS.NO_TOWER_SELECTED;
                }
            } else {
                newState.moveResult = MOVE_RESULTS.NOT_YOUR_TURN;
            }
            break;
            
        case ACTION_TYPES.UPDATE_GAME:
            try {
                const updatedState = Object.assign(newState, action.game);
                const initialTowers = Game.createInitialTowerPositions(Object.keys(action.game.players));
                const moves = action.game.moves;

                if (moves && moves.length > 0) {
                    const finalTowers = GameLogic.executeMoves(initialTowers, moves);
                    const currentColor = moves[moves.length - 1].targetField.color;

                    Object.assign(updatedState, {
                        towerPositions: finalTowers,
                        valid: true,
                        currentColor
                    });
                    return updatedState;
                } else {
                    Object.assign(updatedState, {
                        towerPositions: initialTowers,
                        valid: true
                    });
                    return updatedState;
                }
            } catch (e) {
                newState.valid = false;
                return newState;
            }

        case ACTION_TYPES.RESUME_GAME:
            delete newState.currentColor;

            return Object.assign(newState, {
                isTutorial: false,
                isAIGame: false,
                selectedTower: undefined,
                moves: [],
                board: Game.createInitialBoard(),
                tutorial: {
                    message: ''
                }
            });
            
        case ACTION_TYPES.START_GAME:
            console.log('created game:', action.game);
            const newGameState = Object.assign({}, action.game);

            return Object.assign(newGameState, {
                isTutorial: false,
                tutorial: {
                    message: ''
                },
                currentColor: undefined,
                selectedTower: undefined,
                board: Game.createInitialBoard(),
                towerPositions: Game.createInitialTowerPositions(Object.keys(action.game.players))
            });

        default:

    }
    
    return newState;
};