import {ACTION_TYPES} from '../actions/index';
import db from '../database';
import GameLogic, { copyTowers } from '../GameLogic';

const initialColors = [
    [0, 1, 2, 3, 4, 5, 6, 7],
    [5, 0, 3, 6, 1, 4, 7, 2],
    [6, 3, 0, 5, 4, 7, 2, 1],
    [3, 2, 1, 0, 7, 6, 5, 4],
    [4, 5, 6, 7, 0, 1, 2, 3],
    [1, 2, 7, 4, 5, 0, 3, 6],
    [2, 7, 4, 1, 6, 3, 0, 5],
    [7, 6, 5, 4, 3, 2, 1, 0],
];

const createInitialTowerPositions = () => {
    const towers = [[],[]];
    const playerTowers = [];
    for (let player = 0; player < 2; player++) {
        for (let color = 0; color < 8; color++) {
            towers[player].push({
                color,
                belongsToPlayer: player,
                x: player === 0 ? color : 7 - color,
                y: player === 0 ? 0 : 7
            });
        }        
    }
    return towers;
}

const createInitialBoard = (colors) => colors.map((row, index) =>
    row.map(
        color => {
            return {
                color
            }
        }
    )
);

export default (state, action) => {
    
    if (typeof(state) === "undefined") {
        return {
            board: createInitialBoard(initialColors),
            players: [],
            currentPlayer: null,
            currentColor: null,
            selectedTower: null,
            moves: [],
            towerPositions: createInitialTowerPositions()
        };
    }
    
    const newState = JSON.parse(JSON.stringify(state));
    const currentPlayer = state.currentPlayer;
    const currentColor = state.currentColor;
    
    switch (action.type) {
        
        case ACTION_TYPES.CLICK_ON_TOWER:
            if (state.game[`player${currentPlayer}`] === action.playerName) {
                const towerOnField = action.tower;
                if (typeof state.game.currentColor === 'undefined' || state.game.currentColor === null || towerOnField.color === state.game.currentColor) {
                    newState.game.selectedField = action.tower;
                }
            }
            break;
        
        case ACTION_TYPES.CLICK_ON_FIELD:
            if (state.game[`player${currentPlayer}`] === action.playerName) {
                let sourceField = null;
                const targetField = action.field;

                if (typeof currentColor === 'undefined') {
                    sourceField = state.selectedField;
                } else {
                    sourceField = state.towerPositions[currentPlayer][currentColor];
                }
                
                if (towerToMove.belongsToPlayer === state.currentPlayer) {
                    const move = {
                        player: currentPlayer,
                        color: currentColor,
                        from: sourceField,
                        to: targetField
                    };

                    try {
                        newState.towerPositions = GameLogic.executeMove(state.towerPositions, move);
                        const nextPlayer = (state.currentPlayer + 1) % 2;
                        const nextColor = targetField.color;

                        if (canMove(newState.towerPositions, nextPlayer, nextColor)) {
                            newState.currentPlayer = nextPlayer;
                            newState.currentColor = nextColor;
                        } else {
                            const blockedTower = newState.towerPositions[nextPlayer][targetField.color];
                            const fieldOfBlockedTower = newState.board[blockedTower.y][blockedTower.x];

                            newState.currentColor = fieldOfBlockedTower.color;
                        }
                        newState.selectedField = null;
                        newState.moves.push(move);
                    } catch (e) {
                        console.log('move has failed, resetting ...', e);
                        newState.currentPlayer = currentPlayer;
                        newState.currentColor = currentColor;
                        newState.selectedField = towerToMove;
                        newState.towerPositions = copyTowers(state.towerPositions);
                    }
                }
            }
            setTimeout(function () {db.ref(`games/${action.currentGame}`).update(newState)}, 0);
            break;
            
        case ACTION_TYPES.UPDATE_GAME:
            return action.game;
            
        case ACTION_TYPES.START_GAME:
            const newGameState = {
                board: createInitialBoard(initialColors),
                game: createInitialGame(0, action.players),
                towerPositions: createInitialTowerPositions()
            };
            setTimeout(function () {db.ref(`games/${action.game}`).update(newGameState)}, 0);
            return newGameState;
            
        default:

    }
    
    return newState;
};