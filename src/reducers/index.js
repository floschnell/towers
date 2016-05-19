import {ACTION_TYPES} from '../actions/index';

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
    const towers = {};
    for (let i = 0; i < 8; i++) {
        towers[`0-${i}`] = {
            belongsToPlayer: 0,
            color: i
        };
        
        towers[`7-${i}`] = {
            belongsToPlayer: 1,
            color: i
        };
    }
    return towers;
}

const createInitialGame = (firstPlayer) => {
    return {
        currentPlayer: firstPlayer,
        currentColor: undefined,
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
    
const getCoordinate = (field) => `${field.y}-${field.x}`;
    
const moveTower = (towerPositions, source, target) => {
    if (fieldHasTower(towerPositions, source)) {
        if (!fieldHasTower(towerPositions, target)) {
            const newTowerPositions = Object.assign({}, towerPositions);
            newTowerPositions[getCoordinate(target)] = newTowerPositions[getCoordinate(source)];
            delete newTowerPositions[getCoordinate(source)];
            return newTowerPositions;
        }
    }
    return towerPositions;
}

const getTowerFromField = (towerPositions, field) => {
    const fieldCoordinates = getCoordinate(field);
    return towerPositions[fieldCoordinates];
}

const fieldHasTower = (towerPositions, field) => {
    const fieldCoordinates = getCoordinate(field);
    return (towerPositions.hasOwnProperty(fieldCoordinates));
}

const checkMove = (player, towerPositions, fromCoords, toCoords) => {
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
            game: createInitialGame(0),
            towerPositions: createInitialTowerPositions()
        };
    }
    
    const newState = JSON.parse(JSON.stringify(state));
    
    switch (action.type) {
        
        case ACTION_TYPES.CLICK_ON_FIELD:
            if (fieldHasTower(state.towerPositions, action.field)) {
                const towerOnField = getTowerFromField(state.towerPositions, action.field);
                if (typeof state.game.currentColor === 'undefined' || towerOnField.color === state.game.currentColor) {
                    newState.game.selectedField = action.field;
                }
            } else {
                if (state.game.selectedField) {
                    const sourceField = state.game.selectedField;
                    const targetField = action.field;
                    const towerToMove = getTowerFromField(state.towerPositions, sourceField);
                    if (towerToMove.belongsToPlayer === state.game.currentPlayer) {
                        if (checkMove(state.game.currentPlayer, state.towerPositions, sourceField, targetField)) {
                            newState.towerPositions = moveTower(state.towerPositions, state.game.selectedField, action.field);
                            newState.game.currentPlayer = (state.game.currentPlayer + 1) % 2;
                            newState.game.currentColor = targetField.color;
                            newState.game.selectedField = null;
                        }
                    }
                }
            }
            break;
            
        default:

    }
    return newState;
};