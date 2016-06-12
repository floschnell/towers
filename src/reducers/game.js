import {ACTION_TYPES} from '../actions/index';
import db from '../database';

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

const createInitialGame = (firstPlayer, players) => {
    return {
        players,
        currentPlayer: firstPlayer,
        currentColor: null,
        selectedTower: null
    };
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
            game: createInitialGame(0, []),
            towerPositions: createInitialTowerPositions()
        };
    }
    
    const newState = JSON.parse(JSON.stringify(state));
    const currentPlayer = state.game.currentPlayer;
    const currentColor = state.game.currentColor;
    
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
                let towerToMove = null;
                if (typeof currentColor === 'undefined') {
                    towerToMove = state.game.selectedField;
                } else {
                    towerToMove = state.towerPositions[currentPlayer][currentColor];
                }

                const sourceField = towerToMove;
                const targetField = action.field;
                if (towerToMove.belongsToPlayer === state.game.currentPlayer) {
                    if (checkMove(state.game.currentPlayer, state.towerPositions, sourceField, targetField)) {
                        newState.towerPositions = moveTower(state.towerPositions, sourceField, targetField);
                        const nextPlayer = (state.game.currentPlayer + 1) % 2;
                        const nextColor = targetField.color;
                        if (canMove(newState.towerPositions, nextPlayer, nextColor)) {
                            newState.game.currentPlayer = nextPlayer;
                            newState.game.currentColor = nextColor;
                        } else {
                            const blockedTower = newState.towerPositions[nextPlayer][targetField.color];
                            const fieldOfBlockedTower = newState.board[blockedTower.y][blockedTower.x];
                            newState.game.currentColor = fieldOfBlockedTower.color;
                        }
                        newState.game.selectedField = null;
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