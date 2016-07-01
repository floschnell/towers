/**
 * Copies a set of towers.
 * 
 * @param {{x: integer, y: integer, color: integer, player: integer}[][]} towers Tower positions to copy over.
 * @returns {{x: integer, y: integer, color: integer, player: integer}[][]} A copy of the incoming tower positions.
 */
export const copyTowers = towers => {
    const copyOfTowers = [];
    for (const player in towers) {
        const copyOfPlayer = [];
        for (const color in towers[player]) {
            copyOfPlayer.push(Object.assign({}, towers[player][color]));
        }
        copyOfTowers.push(copyOfPlayer);
    }
    return copyOfTowers;
};

/**
 * @param {{x: integer, y: integer}} fieldA
 * @param {{x: integer, y: integer}} fieldA
 * @returns {boolean} Whether the fields are equal.
 */
const fieldsAreEqual = (fieldA, fieldB) => (fieldA.x == fieldB.x && fieldA.y == fieldB.y);

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
export const getTowerFromField = (towers, field, player = null) => {
    let arrayOfTowers = [];
    if (player === null) {
        arrayOfTowers = towers.reduce((previous, current) => previous.concat(current));
    } else {
        arrayOfTowers = towers[player];
    }
    return arrayOfTowers.find(tower => tower.x === field.x && tower.y === field.y);
};


/**
 * Checks if there is currently a tower placed on the given field coordinates.
 * 
 * @param {{x: integer, y: integer, color: integer, player: integer}[][]} towers Data structure containing the towers and their positions.
 * @param {{x: integer, y: integer}} field Coordinates of the fied that we want to check.
 * @returns {boolean} Whether there is a tower on the given field coordinates.
 */
export const fieldHasTower = (towers, field) => {
    const arrayOfTowers = towers.reduce((previous, current) => previous.concat(current));
    return arrayOfTowers.some(tower => tower.x === field.x && tower.y === field.y);
};

/**
 * Tells whether the given player should move up- or downward.
 * 
 * @param {integer} player What player to get the move direction for.
 * @return {integer} -1 if upward, 1 if downward.
 */
const playerMoveDirection = player => (player === 0) ? 1 : -1;

export default class GameLogic {

    /**
     * Moves a tower from the source field to the target field.
     * 
     * @param {{x: integer, y: integer, color: integer, player: integer}[][]} towers Current tower positions.
     * @param {{x: integer, y: integer}} sourceField Field where the tower currently is.
     * @param {{x: integer, y: integer}} targetField Field where the tower should go.
     * @returns {{x: integer, y: integer, color: integer, player: integer}[][]} New tower positions object.
     */
    static executeMove(towers, player, color, sourceField, targetField) {
        if (GameLogic.checkMove(towers, player, color, sourceField, targetField)) {
            const newTowers = copyTowers(towers);
            const towerToMove = getTowerFromField(newTowers, sourceField);
            const { x, y } = targetField;
            towerToMove.x = x;
            towerToMove.y = y;
            return newTowers;
        } else {
            throw 'Move is not valid and could not be executed!';
        }
    };

    /**
     * Checks if moving a tower from sourceField to targetField is a valid move.
     * 
     * @param {{x: integer, y: integer, color: integer, player: integer}[][]} Data structure containing the towers and their positions.
     * @param {integer} player Index of the player that 
     * @param {integer} color Field where the move starts.
     * @param {{x: integer, y: integer}} targetField Field where the move will end.
     * @returns {boolean} Whether this is a valid move.
     */
    static checkMove(towers, player, color, sourceField, targetField) {
        const tower = towers[player][color];
        const deltaX = targetField.x - tower.x;
        const deltaY = targetField.y - tower.y;
        const moveDirection = playerMoveDirection(player);
        const moveStraight = (deltaX === 0);
        const moveDiagonally = Math.abs(deltaX) === Math.abs(deltaY);

        const towerIsOnSource = fieldsAreEqual(sourceField, {
            x: tower.x,
            y: tower.y
        });
        const targetIsFree = !fieldHasTower(towers, targetField);
        const directionValid = (deltaY > 0 && moveDirection > 0) || (deltaY < 0 && moveDirection < 0);
        const moveInLine = moveStraight || moveDiagonally;
        const moveX = (deltaX === 0) ? 0 : (deltaX / Math.abs(deltaX));

        const obstacleOnWay = (towers, currentField, targetField, moveX, moveY) => {
            const nextField = {
                x: currentField.x + moveX,
                y: currentField.y + moveY
            };

            if (fieldHasTower(towers, nextField)) {
                return true;
            } else if (fieldsAreEqual(nextField, targetField)) {
                return false;
            } else {
                return obstacleOnWay(towers, nextField, targetField, moveX, moveY);
            }
        };

        return towerIsOnSource
            && targetIsFree
            && directionValid
            && moveInLine
            && !obstacleOnWay(towers, sourceField, targetField, moveX, moveDirection);
    };    

    /**
     * Checks whether a player can make a valid move with a certain color.
     * 
     * @param {{x: integer, y: integer, color: integer, player: integer}[][]} towers Data structure containing the towers and their positions. 
     * @param {integer} player Index of the player that should be checked.
     * @param {integer} color Color of the tower the player needs to use.
     * @returns {boolean} Whether the player is able to make a valid move with the tower.
     */
    static canMove(towers, player, color) {
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
    };

    /**
     * Executes moves on a set of towers and returns the resulting new tower positions.
     * 
     * @param {{x: integer, y: integer, color: integer, player: integer}[][]} towers Position of the player's towers.
     * @param {{player:integer,color:integer,from:{x:integer, y:integer},to:{x:integer, y:integer}}[]} moves An array of moves.
     * @returns {{x: integer, y: integer, color: integer, player: integer}[][]} Tower positions after all moves have been executed.
     */
    static executeMoves(towers, moves) {
        let resultingTowers = copyTowers(towers);
        for (const index in moves) {
            const move = moves[index];
            const tower = resultingTowers[move.player][move.color];
            if (tower.x == move.from.x && tower.y == move.from.y) {
                resultingTowers = GameLogic.executeMove(resultingTowers, move.player, move.color, move.from, move.to);
            } else {
                throw `Tower description of move ${move} does not match the tower on that field.`;
            }
        }
        return resultingTowers;
    };
}