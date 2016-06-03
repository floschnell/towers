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
        player0: players[0],
        player1: players[1],
        currentPlayer: firstPlayer,
        currentColor: null,
        selectedField: null
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

/**
 * Moves tower from source location to the target field.
 * Returns a new tower positions object.
 */  
const moveTower = (towerPositions, source, target) => {
    if (fieldHasTower(towerPositions, source)) {
        if (!fieldHasTower(towerPositions, target)) {
            const newTowerPositions = JSON.parse(JSON.stringify(towerPositions));
            const towerToMove = getTowerFromField(newTowerPositions, source);
            const { x, y } = target;
            towerToMove.x = x;
            towerToMove.y = y;
            return newTowerPositions;
        }
    }
    return towerPositions;
}

/**
 * Gets the tower from the field at the given position.
 * Returns undefined if there is no tower on that field.
 * You can pass the owner of the tower to speed up search.
 */
const getTowerFromField = (towerPositions, {x, y}, player = null) => {
    let towers = [];
    if (player === null) {
        towers = towerPositions.reduce((previous, current) => previous.concat(current));
    } else {
        towers = towerPositions[player];
    }
    return towers.find(tower => tower.x === x && tower.y === y);
}

/**
 * Checks if there is a tower on the field with the given position.
 */
const fieldHasTower = (towerPositions, {x, y}) => {
    const towers = towerPositions.reduce((previous, current) => previous.concat(current));
    return towers.some(tower => tower.x === x && tower.y === y);
}

/**
 * Checks if moving a tower from a source to a target location by a certain player is according to the rules.
 */
export const checkMove = (player, towerPositions, fromCoords, toCoords) => {
    const deltaX = fromCoords.x - toCoords.x;
    const deltaY = fromCoords.y - toCoords.y;
    if (((deltaY < 0 && player === 0) || (deltaY > 0 && player === 1))
        && (Math.abs(deltaY) === Math.abs(deltaX) || deltaX === 0)) {
            let x = 0;
        for (let y = 0; y < Math.abs(deltaY); y++) {
            const xcoord = fromCoords.x + ((deltaX > 0) ? (0-x) : x);
            const ycoord = fromCoords.y + ((deltaY > 0) ? (0-y) : y);
            if ((x !== 0 || y !== 0) && fieldHasTower(towerPositions, {x: xcoord, y: ycoord})) {
                return false;
            }
            if (x < Math.abs(deltaX)) x++;
        }
        return true;
    }
    return false;
}

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
                if (currentColor === 'undefined') {
                    towerToMove = state.game.selectedField;
                } else {
                    towerToMove = state.towerPositions[currentPlayer][currentColor];
                }
 
                const sourceField = towerToMove;
                const targetField = action.field;
                if (towerToMove.belongsToPlayer === state.game.currentPlayer) {
                    if (checkMove(state.game.currentPlayer, state.towerPositions, sourceField, targetField)) {
                        newState.towerPositions = moveTower(state.towerPositions, sourceField, targetField);
                        newState.game.currentPlayer = (state.game.currentPlayer + 1) % 2;
                        newState.game.currentColor = targetField.color;
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