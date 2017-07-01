import Board, {BoardFactory} from './Board';
import Logger from '../logger';

export const CHECK_MOVE_RESULT = {
  VALID: 0,
  NO_TOWER_ON_SOURCE: 1,
  NOT_STRAIGHT_OR_DIAGONALLY: 2,
  NOT_FORWARD: 3,
  OBSTACLE_ON_WAY: 4,
};

/**
 * Encapsulates helper methods for game objects.
 *
 * @export
 * @class Game
 */
export default class Game {
  /**
   * @static
   * @param {GameStructure} game
   * @return {String} Key of the game that was passed.
   */
  static getKey(game) {
    const playerUIDs = Object.keys(game.players);
    const playerA = playerUIDs[0];
    const playerB = playerUIDs[1];

    if (playerA < playerB) {
      return `${playerA}-${playerB}`;
    } else {
      return `${playerB}-${playerA}`;
    }
  }

  /**
   * @static
   * @param {GameStructure} game
   * @param {String} playerID
   * @return {Player}
   *
   * @memberOf Game
   */
  static getPlayer(game, playerID) {
    return Object.assign(game.players[playerID], {id: playerID});
  }

  /**
   * @static
   * @param {Game} game
   * @param {String} playerID
   * @return {Player}
   *
   * @memberOf Game
   */
  static getOpponent(game, playerID) {
    const opponentID = Game.getOpponentID(game, playerID);

    return Object.assign(game.players[opponentID], {id: opponentID});
  }

  /**
   * @static
   * @param {any} game The game in which the two player's are competing.
   * @param {any} playerID The player's ID.
   * @return {string} ID of the player's opponent in this game.
   *
   * @memberOf Game
   */
  static getOpponentID(game, playerID) {
    return Object.keys(game.players).find((id) => id !== playerID);
  }

  /**
   * Retrieves the number for a player in the context of a game.
   *
   * @static
   * @param {GameStructure} game Game context.
   * @param {any} playerID ID of the player to get the number for.
   * @return {number} Player number.
   *
   * @memberof Game
   */
  static getPlayerNumber(game, playerID) {
    return playerID > Game.getOpponentID(game, playerID) ? 1 : 0;
  }

  /**
   * Retrieves the player's move direction on the given board.
   *
   * @param {GameStructure} game The game state.
   * @param {string} playerID The player's name.
   * @return {number} The move direction: 1 for downwards and -1 for upwards.
   */
  static getMoveDirectionFor(game, playerID) {
    const playerNumber = Game.getPlayerNumber(game, playerID);

    return Board.getMoveDirectionFor(playerNumber);
  }

  /**
   * Retrieves the player's target row on the given board.
   * Target row is the starting row of the opponent at the same time.
   *
   * @param {GameStructure} game The game state.
   * @param {string} player The player's name.
   * @return {number} The target row which is either 0 or 7.
   */
  static getTargetRowFor(game, player) {
    if (player > Game.getOpponentID(game, player)) {
      return 0;
    } else {
      return 7;
    }
  }

  /**
   * Checks whether one of the players has won.
   *
   * @static
   * @param {GameStructure} game Game to check.
   * @return {boolean} Whether the game has ended or not.
   *
   * @memberof Game
   */
  static hasEnded(game) {
    return Game.getWinner(game) !== null;
  }

  /**
   * Retrieves the tower for a given player and color.
   *
   * @static
   * @param {GameStructure} game The game with the current state.
   * @param {string} playerID Player to get the tower for.
   * @param {number} color Color of the tower.
   * @return {Tower}
   *
   * @memberof Game
   */
  static getTowerForPlayerAndColor(game, playerID, color) {
    const playerNumber = Game.getPlayerNumber(game, playerID);
    const towerPosition = Board.getTowerForPlayerAndColor(
      game.board,
      playerNumber,
      color
    );

    return Object.assign(towerPosition, {
      belongsToPlayer: playerID,
      color,
    });
  }

  /**
   * Gets the game's winner.
   *
   * @static
   * @param {GameStructure} game Game to check.
   * @return {string|null} ID of the player who has won.
   *
   * @memberof Game
   */
  static getWinner(game) {
    const winner = Object.keys(game.players).find((playerID) => {
      const targetRow = Game.getTargetRowFor(game, playerID);
      const playerNumber = Game.getPlayerNumber(game, playerID);

      for (let color = 0; color < 8; color++) {
        const towerPosition = Board.getTowerForPlayerAndColor(
          game.board,
          playerNumber,
          color
        );

        if (towerPosition.y === targetRow) {
          return true;
        }
      }
    });
    return winner || null;
  }

  /**
   * Check if the current game state corresponds to the game moves.
   *
   * @param {GameStructure} game The game state that should be checked.
   * @param {MoveStructure[]} moves Moves that the current game state should be
   *                                checked against.
   */
  static _sanityCheckMoves(game, moves) {
    const lastMove = moves[moves.length - 1];

    if (game.currentPlayer === game.player) {
      throw new Error(
        `Current player '${game.currentPlayer}' has to be different than the player of the last move!` // eslint-disable-line
      );
    }

    if (game.currentColor !== lastMove.targetField.color) {
      throw new Error(
        `Current color is ${game.currentColor} when it should be ${lastMove.targetField.color}` // eslint-disable-line
      );
    }
  }

  /**
   * Initializes the board for a certain game.
   * That involves creating the board structure and
   * executing all the moves that have been stored in the database.
   *
   * @param {GameStructure} game
   * @return {GameStructure} The updated game structure.
   * @static
   *
   * @memberof Game
   */
  static initialize(game) {
    game.board = BoardFactory.createBoard();
    for (let color = 0; color < 8; color++) {
      Board.setTower(game.board, 0, color, color, 0);
    }
    for (let color = 0; color < 8; color++) {
      Board.setTower(game.board, 1, color, 7 - color, 7);
    }

    if (game.moves && game.moves.length > 0) {
      Game.executeMoves(game, game.moves);
      Game._sanityCheckMoves(game, game.moves);
    }

    return game;
  }

  /**
   * Gets the tower positions for a specific player.
   *
   * @static
   * @param {GameStructure} game Game that holds board, players and towers.
   * @param {string} playerID ID of the player to get the tower positions for.
   * @return {Array<TowerStructure>} Tower positions for this player.
   *
   * @memberof Game
   */
  static getTowersForPlayer(game, playerID) {
    const playerNumber = Game.getPlayerNumber(game, playerID);
    const towerPositions = [];

    for (let color = 0; color < 8; color++) {
      const tower = Board.getTowerForPlayerAndColor(game.board, playerNumber, color);
      towerPositions[color] = Object.assign(tower, {
        belongsToPlayer: playerID,
        color,
      });
    }
    return towerPositions;
  }

  /**
   * Executes a move on the given game.
   *
   * @static
   * @param {GameStructure} game Game to execute the move for.
   * @param {MoveStructure} move Move to execute.
   * @return {void}
   * @throws {Error}
   *
   * @memberof Game
   */
  static executeMove(game, move) {
    const playerNumber = Game.getPlayerNumber(game, move.player);

    const checkMoveResult = Game.checkMoveForValidity(game, move);
    if (checkMoveResult === CHECK_MOVE_RESULT.VALID) {
      const success = Board.moveTower(
        game.board,
        playerNumber,
        move.color,
        move.sourceField.x,
        move.sourceField.y,
        move.targetField.x,
        move.targetField.y
      );

      if (!success) {
        throw new Error('Tower could not be moved on the board!');
      }
    } else {
      throw new Error(
        `The move '${JSON.stringify(move)}' is not valid, result: ${checkMoveResult}!`
      );
    }

    Logger.info('moved from', move.sourceField, 'to', move.targetField);
  }

  /**
   * This will take each move and execute them sequentially.
   *
   * @static
   * @param {GameStructure} game Game to execute the moves on.
   * @param {Array<MoveStructure>} moves Moves to execute in row.
   * @return {void}
   *
   * @memberof Game
   */
  static executeMoves(game, moves) {
    for (const move of moves) {
      Game.executeMove(game, move);
    }
  }

  /**
   * Checks whether a player can move a tower with a certain color.
   *
   * @static
   * @param {GameStructure} game Current game state.
   * @param {string} player Player that needs to move.
   * @param {number} color Color of the tower that needs to be moved.
   * @return {boolean} Whether the player can move the tower in question.
   *
   * @memberof Game
   */
  static canMove(game, player, color) {
    const playerNumber = Game.getPlayerNumber(game, player);
    const towerToMove = Board.getTowerForPlayerAndColor(
      game.board,
      playerNumber,
      color
    );
    const moveDirection = Game.getMoveDirectionFor(game, player);
    let canMove = false;

    if (towerToMove.x < 7) {
      canMove =
        canMove ||
        !Board.coordHasTower(
          game.board,
          towerToMove.x + 1,
          towerToMove.y + moveDirection
        );
    }
    if (towerToMove.y + moveDirection <= 7 && towerToMove.y + moveDirection >= 0) {
      canMove =
        canMove ||
        !Board.coordHasTower(game.board, towerToMove.x, towerToMove.y + moveDirection);
    }
    if (towerToMove.x > 0) {
      canMove =
        canMove ||
        !Board.coordHasTower(
          game.board,
          towerToMove.x - 1,
          towerToMove.y + moveDirection
        );
    }
    return canMove;
  }

  /**
   * Moves carefully from current field to a target field.
   * Carefully means, that each if there are obstacles on the way
   * the tower will not be able to cross them.
   *
   * @static
   * @param {GameStructure} game
   * @param {FieldStructure} currentField
   * @param {FieldStructure} targetField
   * @return {FieldStructure} Either the target field or any field on the way,
   *                          if there was an obstacle.
   *
   * @memberof Game
   */
  static moveCarefully(game, currentField, targetField) {
    if (currentField.x === targetField.x && currentField.y === targetField.y) {
      return targetField;
    } else {
      const dx = targetField.x - currentField.x;
      const dy = targetField.y - currentField.y;
      const nextField = Object.assign({}, currentField);

      if (dx > 0) {
        nextField.x++;
      } else if (dx < 0) {
        nextField.x--;
      }

      if (dy > 0) {
        nextField.y++;
      } else if (dy < 0) {
        nextField.y--;
      }

      if (Board.coordHasTower(game.board, nextField.x, nextField.y)) {
        return currentField;
      } else {
        return Game.moveCarefully(game, nextField, targetField);
      }
    }
  }

  /**
   * Checks whether the specific move is valid
   * in context of the given game.
   *
   * @static
   * @param {GameStructure} game
   * @param {MoveStructure} move
   * @return {CHECK_MOVE_RESULT}
   *
   * @memberof Game
   */
  static checkMoveForValidity(game, move) {
    // check if there is a tower to move
    const towerColor = Board.getTowerColorAtCoord(
      game.board,
      move.sourceField.x,
      move.sourceField.y
    );
    if (towerColor !== move.color) {
      Logger.info(
        'There is no matching tower on source field',
        move.sourceField,
        towerColor
      );
      return CHECK_MOVE_RESULT.NO_TOWER_ON_SOURCE;
    }

    // check move directions
    const deltaX = move.targetField.x - move.sourceField.x;
    const deltaY = move.targetField.y - move.sourceField.y;
    const moveDirection = Game.getMoveDirectionFor(game, move.player);
    if (deltaX !== 0 && Math.abs(deltaX) !== Math.abs(deltaY)) {
      Logger.info('Move needs to be either straight or diagonally', deltaX, deltaY);
      return CHECK_MOVE_RESULT.NOT_STRAIGHT_OR_DIAGONALLY;
    }
    if ((deltaY > 0 && moveDirection < 0) || (deltaY < 0 && moveDirection > 0)) {
      Logger.info('Can not move in reverse direction', deltaY, moveDirection);
      return CHECK_MOVE_RESULT.NOT_FORWARD;
    }

    // try to move the tower to destination
    const actualField = Game.moveCarefully(game, move.sourceField, move.targetField);
    if (actualField.x !== move.targetField.x || actualField.y !== move.targetField.y) {
      Logger.info(
        'Could not move because of an obstacle.',
        actualField,
        move.sourceField,
        move.targetField
      );
      return CHECK_MOVE_RESULT.OBSTACLE_ON_WAY;
    }

    return CHECK_MOVE_RESULT.VALID;
  }
}
