import Logger from './logger';

/**
 * Copies a set of towers.
 *
 * @param {{x: integer, y: integer, color: integer, player: integer}[][]} towersA Tower positions.
 * @param {{x: integer, y: integer, color: integer, player: integer}[][]} towersB Tower positions.
 * @returns {{x: integer, y: integer, color: integer, player: integer}[][]} A copy of the incoming tower positions.
 */
export const towerPositionsAreEqual = (towersA, towersB) => {
  for (const player in towersA) {
    for (const color in towersA[player]) {
      const fieldA = towersA[player][color];
      const fieldB = towersB[player][color];

      const equal =
        fieldA.color === fieldB.color &&
        fieldA.player === fieldB.player &&
        fieldA.x === fieldB.x &&
        fieldA.y === fieldB.y;
      if (!equal) return false;
    }
  }
  return true;
};

/**
 * Copies a set of towers.
 *
 * @param {{x: integer, y: integer, color: integer, player: integer}[][]} towers Tower positions to copy over.
 * @returns {{x: integer, y: integer, color: integer, player: integer}[][]} A copy of the incoming tower positions.
 */
export const copyTowers = (towers) => {
  const copyOfTowers = {};
  for (const player in towers) {
    const copyOfPlayer = [];
    for (const color in towers[player]) {
      copyOfPlayer.push(Object.assign({}, towers[player][color]));
    }
    copyOfTowers[player] = copyOfPlayer;
  }
  return copyOfTowers;
};

/**
 * @param {{x: integer, y: integer}} fieldA
 * @param {{x: integer, y: integer}} fieldA
 * @returns {boolean} Whether the fields are equal.
 */
export const fieldsAreEqual = (fieldA, fieldB) =>
  fieldA.x == fieldB.x && fieldA.y == fieldB.y;

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
    arrayOfTowers = Object.values(towers).reduce((previous, current) =>
      previous.concat(current)
    );
  } else {
    arrayOfTowers = towers[player];
  }
  return arrayOfTowers.find((tower) => tower.x === field.x && tower.y === field.y);
};

/**
 * Checks if there is currently a tower placed on the given field coordinates.
 *
 * @param {{x: integer, y: integer, color: integer, player: integer}[][]} towers Data structure containing the towers and their positions.
 * @param {{x: integer, y: integer}} field Coordinates of the fied that we want to check.
 * @returns {boolean} Whether there is a tower on the given field coordinates.
 */
export const fieldHasTower = (towers, field) => {
  const arrayOfTowers = Object.values(towers).reduce((previous, current) =>
    previous.concat(current)
  );
  return arrayOfTowers.some((tower) => tower.x === field.x && tower.y === field.y);
};

export const getOpponent = (player, players) =>
  players.find((opponent) => opponent !== player);

/**
 * Tells whether the given player should move up- or downward.
 *
 * @param {integer} player What player to get the move direction for.
 * @return {integer} -1 if upward, 1 if downward.
 */
export const playerMoveDirection = (player, players) =>
  (player > getOpponent(player, players) ? -1 : 1);

export default class GameLogic {
  /**
     * Moves a tower from the source field to the target field.
     *
     * @param {{x: integer, y: integer, color: integer, player: integer}[][]} towers Data structure containing the towers and their positions.
     * {{player:integer,color:integer,sourceField:{x:integer, y:integer},targetField:{x:integer, y:integer}}} move What tower of which player should be moved.
     * @returns {{x: integer, y: integer, color: integer, player: integer}[][]} New tower positions object.
     */
  static executeMove(towers, move) {
    if (GameLogic.checkMove(towers, move)) {
      const {sourceField, targetField} = move;
      const newTowers = copyTowers(towers);
      const towerToMove = getTowerFromField(newTowers, sourceField);
      const {x, y} = targetField;
      towerToMove.x = x;
      towerToMove.y = y;
      return newTowers;
    } else {
      throw 'Move is not valid and could not be executed!';
    }
  }

  /**
     * Checks if moving a tower from sourceField to targetField is a valid move.
     *
     * @param {{x: integer, y: integer, color: integer, player: integer}[][]} towers Data structure containing the towers and their positions.
     * @param {{player:integer,color:integer,sourceField:{x:integer, y:integer},targetField:{x:integer, y:integer}}} move What tower of which player should be moved.
     * @returns {boolean} Whether this is a valid move.
     */
  static checkMove(towers, {player, color, sourceField, targetField}) {
    const tower = towers[player][color];
    const deltaX = targetField.x - tower.x;
    const deltaY = targetField.y - tower.y;
    const moveDirection = playerMoveDirection(player, Object.keys(towers));
    const moveStraight = deltaX === 0;
    const moveDiagonally = Math.abs(deltaX) === Math.abs(deltaY);

    const towerIsOnSource = fieldsAreEqual(sourceField, {
      x: tower.x,
      y: tower.y,
    });
    const targetIsFree = !fieldHasTower(towers, targetField);
    const directionValid =
      (deltaY > 0 && moveDirection > 0) || (deltaY < 0 && moveDirection < 0);
    const moveInLine = moveStraight || moveDiagonally;

    Logger.debug(
      'evaluating move:',
      towers,
      player,
      color,
      sourceField,
      targetField,
      towerIsOnSource,
      targetIsFree,
      directionValid,
      moveInLine
    );

    return (
      towerIsOnSource &&
      targetIsFree &&
      directionValid &&
      moveInLine &&
      !GameLogic._obstacleOnWay(
        towers,
        sourceField,
        targetField,
        GameLogic._getMoveDirection(deltaX),
        moveDirection
      )
    );
  }

  static _getMoveDirection(delta) {
    if (delta === 0) {
      return 0;
    } else if (delta > 0) {
      return 1;
    } else {
      return -1;
    }
  }

  static _obstacleOnWay(towers, currentField, targetField, moveX, moveY) {
    if (fieldsAreEqual(currentField, targetField)) {
      return false;
    }

    const nextField = {
      x: currentField.x + moveX,
      y: currentField.y + moveY,
    };

    if (fieldHasTower(towers, nextField)) {
      return true;
    } else {
      return GameLogic._obstacleOnWay(towers, nextField, targetField, moveX, moveY);
    }
  }

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
    const moveDirection = playerMoveDirection(player, Object.keys(towers));
    let canMove = false;

    if (towerToMove.x < 7) {
      canMove =
        canMove ||
        !fieldHasTower(towers, {
          x: towerToMove.x + 1,
          y: towerToMove.y + moveDirection,
        });
    }
    if (towerToMove.y + moveDirection <= 7 && towerToMove.y + moveDirection >= 0) {
      canMove =
        canMove ||
        !fieldHasTower(towers, {x: towerToMove.x, y: towerToMove.y + moveDirection});
    }
    if (towerToMove.x > 0) {
      canMove =
        canMove ||
        !fieldHasTower(towers, {
          x: towerToMove.x - 1,
          y: towerToMove.y + moveDirection,
        });
    }
    return canMove;
  }

  /**
     * Executes moves on a set of towers and returns the resulting new tower positions.
     *
     * @param {{x: integer, y: integer, color: integer, player: integer}[][]} towers Position of the player's towers.
     * @param {{player:integer,color:integer,sourceField:{x:integer, y:integer},targetField:{x:integer, y:integer}}[]} moves An array of moves.
     * @returns {{x: integer, y: integer, color: integer, player: integer}[][]} Tower positions after all moves have been executed.
     */
  static executeMoves(towers, moves) {
    let resultingTowers = copyTowers(towers);
    for (const move of moves) {
      resultingTowers = GameLogic.executeMove(resultingTowers, move);
    }
    return resultingTowers;
  }
}
