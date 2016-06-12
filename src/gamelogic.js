/**
 * Moves a tower from the source field to the target field.
 * 
 * @param {{x: integer, y: integer, color: integer, player: integer}[][]} towers Current tower positions.
 * @param {{x: integer, y: integer}} sourceField Field where the tower currently is.
 * @param {{x: integer, y: integer}} targetField Field where the tower should go.
 * @returns {object} New tower positions object.
 */
export const moveTower = (towers, sourceField, targetField) => {
    if (fieldHasTower(towers, sourceField)) {
        if (!fieldHasTower(towers, targetField)) {
            const newTowers = Object.assign({}, towers);
            const towerToMove = getTowerFromField(newTowers, sourceField);
            const { x, y } = targetField;
            towerToMove.x = x;
            towerToMove.y = y;
            return newTowers;
        }
    }
    return towers;
}

/**
 * Gets the tower from the field at the given position.
 * Returns undefined if there is no tower on that field.
 * You can pass the owner of the tower to speed up search.
 * 
 * @param {{x: integer, y: integer, color: integer, player: integer}[][]} towers Data structure containing the towers.
 * @param {{x: integer, y: integer}} field Field where we want to get the tower from.
 * @param {integer|null} [player] Index of the player this tower belongs to.
 * @returns {{x: integer, y: integer, player: integer, color: integer}}
 */
const getTowerFromField = (towers, field, player = null) => {
    let arrayOfTowers = [];
    if (player === null) {
        arrayOfTowers = towers.reduce((previous, current) => previous.concat(current));
    } else {
        arrayOfTowers = towers[player];
    }
    return arrayOfTowers.find(tower => tower.x === field.x && tower.y === field.y);
}


/**
 * Checks if there is currently a tower placed on the given field coordinates.
 * 
 * @param {{x: integer, y: integer, color: integer, player: integer}[][]} towers Data structure containing the towers and their positions.
 * @param {{x: integer, y: integer}} field Coordinates of the fied that we want to check.
 * @returns {boolean} Whether there is a tower on the given field coordinates.
 */
const fieldHasTower = (towers, field) => {
    const arrayOfTowers = towers.reduce((previous, current) => previous.concat(current));
    return arrayOfTowers.some(tower => tower.x === field.x && tower.y === field.y);
}

/**
 * Checks if moving a tower from sourceField to targetField is a valid move.
 * 
 * @param {{x: integer, y: integer, color: integer, player: integer}[][]} Data structure containing the towers and their positions.
 * @param {integer} player Index of the player that 
 * @param {integer} color Field where the move starts.
 * @param {{x: integer, y: integer}} targetField Field where the move will end.
 * @returns {boolean} Whether this is a valid move.
 */
export const checkMove = (towers, player, color, targetField) => {
    const tower = towers[player][color];
    const deltaX = tower.x - targetField.x;
    const deltaY = tower.y - targetField.y;
    if (((deltaY < 0 && player === 0) || (deltaY > 0 && player === 1))
        && (Math.abs(deltaY) === Math.abs(deltaX) || deltaX === 0)) {
        let x = 0;
        for (let y = 0; y < Math.abs(deltaY); y++) {
            const xcoord = tower.x + ((deltaX > 0) ? (0-x) : x);
            const ycoord = tower.y + ((deltaY > 0) ? (0-y) : y);
            if ((x !== 0 || y !== 0) && fieldHasTower(towers, {x: xcoord, y: ycoord})) {
                return false;
            }
            if (x < Math.abs(deltaX)) x++;
        }
        return true;
    }
    return false;
}


/**
 * Checks whether a player can make a valid move with a certain color.
 * 
 * @param {{x: integer, y: integer, color: integer, player: integer}[][]} towers Data structure containing the towers and their positions. 
 * @param {integer} player Index of the player that should be checked.
 * @param {integer} color Color of the tower the player needs to use.
 * @returns {boolean} Whether the player is able to make a valid move with the tower.
 */
export const canMove = (towers, player, color) => {
    const towerToMove = towers[player][color];
    const moveDirection = (player === 0) ? 1 : -1;
    let canMove = false;
    if (towerToMove.x < 7) {
        canMove = canMove || (!fieldHasTower(towers, { x: towerToMove.x + 1, y: towerToMove.y + moveDirection }));
    }
    if (towerToMove.y + moveDirection <= 7 && towerToMove.y + moveDirection >= 0) {
        canMove = canMove || (!fieldHasTower(towers, { x: towerToMove.x, y: towerToMove.y + moveDirection }));
    }
    if (towerToMove.x > 0) {
        canMove = canMove || (!fieldHasTower(towers, { x: towerToMove.x - 1, y: towerToMove.y + moveDirection }));
    }
    return canMove;
}