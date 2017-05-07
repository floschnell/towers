import Logger from '../logger';

export const BOARD_COLORS = [
  [0, 1, 2, 3, 4, 5, 6, 7],
  [5, 0, 3, 6, 1, 4, 7, 2],
  [6, 3, 0, 5, 4, 7, 2, 1],
  [3, 2, 1, 0, 7, 6, 5, 4],
  [4, 5, 6, 7, 0, 1, 2, 3],
  [1, 2, 7, 4, 5, 0, 3, 6],
  [2, 7, 4, 1, 6, 3, 0, 5],
  [7, 6, 5, 4, 3, 2, 1, 0],
];

const BOARD_SIZE_IN_ELEMENTS = 80;
const BOARD_SIZE_IN_BYTES = BOARD_SIZE_IN_ELEMENTS * 4;
const REALLOC_BATCH_EXP = 10; // that means, we will allocate 320 kb batches
const REALLOC_BATCH_SIZE = 1 << REALLOC_BATCH_EXP;

/**
 * The board factory manages memory.
 */
export class BoardFactory {
  /**
   * Creates a new Facotry with its own memory.
   */
  constructor() {
    this.size = 0;
    this.available = 0;
    this.buffers = [];
    this.currentBufferWindow = null;
    this.currentBufferWindowPosition = 0;
    this._reset();
  }

  /**
   * Creates a new board and reserves its own memory.
   *
   * @static
   * @return {BoardStructure}
   *
   * @memberof BoardFactory
   */
  static createBoard() {
    return new Uint32Array(BOARD_SIZE_IN_ELEMENTS);
  }

  /**
   * Copies a board into a new memory location.
   * Does not use shared memory and thus is slower than
   * the factory instance's method.
   *
   * @param {BoardStructure} board Board to copy.
   * @return {BoardStructure}
   */
  static copyBoard(board) {
    const newBoard = BoardFactory.createBoard();
    newBoard.set(board);
    return newBoard;
  }

  /**
   * Creates an empty board.
   * Uses the shared memory of the factory and thus
   * will be faster than using the static createBoard method.
   *
   * @memberof BoardFactory
   * @return {Uint32Array}
   */
  createBoard() {
    // allocate a new memory batch if needed
    if (this.size >= this.available) {
      this.currentBufferWindow = new ArrayBuffer(
        REALLOC_BATCH_SIZE * BOARD_SIZE_IN_BYTES
      );
      this.buffers.push(this.currentBufferWindow);
      this.available += REALLOC_BATCH_SIZE;
      this.currentBufferWindowPosition = 0;
    }
    // create view on memory fragment
    const data = new Uint32Array(
      this.currentBufferWindow,
      this.currentBufferWindowPosition,
      BOARD_SIZE_IN_ELEMENTS
    );
    this.size++;
    this.currentBufferWindowPosition += BOARD_SIZE_IN_BYTES;
    return data;
  }

  /**
   * Copies a board into a new memory location.
   *
   * @param {Uint32Array} board Board to copy.
   * @return {Uint32Array}
   */
  copyBoard(board) {
    const newBoard = this.createBoard();
    newBoard.set(board);
    return newBoard;
  }

  /**
   * releases all memory and also all boards that have been
   * created by this facotry.
   */
  dispose() {
    this._reset();
  }

  /**
   * Resets the factory.
   */
  _reset() {
    delete this.buffers;
    this.currentBufferWindow = new ArrayBuffer(
      REALLOC_BATCH_SIZE * BOARD_SIZE_IN_BYTES
    );
    this.buffers = [this.currentBufferWindow];
    this.currentBufferWindowPosition = 0;
    this.available = REALLOC_BATCH_SIZE;
    this.size = 0;
  }
}

/**
 * This is an abstraction of the database model.
 */
export default class Board {
  /**
   * Moves a tower from one field to another.
   *
   * @param {Uint32Array} board Board on which the move should be performed.
   * @param {number} playerNumber Player the tower belongs to. Either 0 or 1.
   * @param {number} color Color that the tower has.
   * @param {number} fromX X coord of the source field.
   * @param {number} fromY Y coord of the source field.
   * @param {number} toX X coord of the target field.
   * @param {number} toY Y coord of the target field.
   * @return {boolean} Whether the tower could be moved.
   */
  static moveTower(board, playerNumber, color, fromX, fromY, toX, toY) {
    const playerColorIndex = playerNumber * 8 + color;
    const towerToMove = board[playerColorIndex];
    const towerToMoveX = towerToMove & 7;
    const towerToMoveY = towerToMove >>> 3;

    if (towerToMoveX === fromX && towerToMoveY === fromY) {
      if (Board.coordHasTower(board, fromX, fromY)) {
        board[playerColorIndex] = (toY << 3) | toX;
        board[fromY * 8 + fromX + 16] = 0;
        board[toY * 8 + toX + 16] = color + 1;
        return true;
      } else {
        Board.printBoard(board);
        Logger.warn(
          'There is no tower that could be moved from',
          fromX,
          fromY,
          'to',
          toX,
          toY
        );
        throw new Error('there is no tower that could be moved!');
      }
    } else {
      throw new Error('tower does not belong to player!');
    }
  }

  /**
   * Retrieves the player's move direction on the given board.
   *
   * @param {number} playerNumber The player's name.
   * @return {number} The move direction: 1 for downwards and -1 for upwards.
   */
  static getMoveDirectionFor(playerNumber) {
    if (playerNumber === 1) {
      return -1;
    } else {
      return 1;
    }
  }

  /**
   * Sets a tower on the specified coordinate.
   *
   * @static
   * @param {Uint32Array} board Board data.
   * @param {number} playerNumber Player number.
   * @param {number} color Color of the tower.
   * @param {number} x X coordinate.
   * @param {number} y Y coordinate.
   *
   * @memberof Board
   */
  static setTower(board, playerNumber, color, x, y) {
    board[y * 8 + x + 16] = color + 1;
    board[playerNumber * 8 + color] = (y << 3) | x;
  }

  /**
   * Retrieves the tower position for a certain color and a player.
   *
   * @static
   * @param {Uint32Array} board Board, which holds the towers.
   * @param {number} playerNumber Either player 0 or 1.
   * @param {number} color Color of the tower.
   * @return {{x: number, y: number}}
   *
   * @memberof Board
   */
  static getTowerForPlayerAndColor(board, playerNumber, color) {
    const tower = board[playerNumber === 1 ? 8 + color : color];

    return {
      x: tower & 7,
      y: tower >> 3,
    };
  }

  /**
   * Checks if there is a tower on the give board coordinate.
   *
   * @static
   * @param {BoardStructure} board The board on which the towers stand.
   * @param {number} x X coordinate of the position that should be checked for a tower.
   * @param {number} y Y coordinate of the position that should be checked for a tower.
   * @return {boolean}
   *
   * @memberof Board
   */
  static coordHasTower(board, x, y) {
    return board[y * 8 + x + 16] > 0;
  }

  /**
   * Retrieves the color of the tower at the given coord.
   *
   * @static
   * @param {BoardStructure} board The board on which the towers stand.
   * @param {number} x X coordinate of the field on which the tower is.
   * @param {number} y Y coordinate of the field on which the tower is.
   * @return {number|null} Color of the tower or null if there is no tower.
   *
   * @memberof Board
   */
  static getTowerColorAtCoord(board, x, y) {
    const color = board[y * 8 + x + 16];
    if (color > 0) {
      return color - 1;
    } else {
      return null;
    }
  }

  /**
   * Gets the color of the board patch at the given position.
   *
   * @static
   * @param {number} x X coord of the patch.
   * @param {number} y Y coord of the patch.
   * @return {number}
   *
   * @memberof Board
   */
  static getBoardColorAtCoord(x, y) {
    return BOARD_COLORS[y][x];
  }

  /**
   * Prints the give board to the console for easier debugging.
   *
   * @static
   * @param {BoardStructure} board The board which should be printed.
   *
   * @memberof Board
   */
  static printBoard(board) {
    for (let y = 0; y < 8; y++) {
      let row = '[';
      for (let x = 0; x < 8; x++) {
        row += board[y * 8 + x + 16] + ',';
      }
      console.log(row + ']');
    }
  }

  /**
   * Returns the opponent player number.
   *
   * @param {number} playerNumber Current player number.
   * @return {number}
   *
   * @memberof AI
   */
  static getOpponentFor(playerNumber) {
    if (playerNumber === 1) {
      return 0;
    } else {
      return 1;
    }
  }

  /**
   * Retrieves the player's target row on the given board.
   * Target row is the starting row of the opponent at the same time.
   *
   * @param {string} playerNumber The player number (either 0 or 1).
   * @return {number} The target row which is either 0 or 7.
   */
  static getTargetRowFor(playerNumber) {
    if (playerNumber === 1) {
      return 0;
    } else {
      return 7;
    }
  }

  /**
   * Gets the number of moves a player can perform from a given position.
   *
   * @static
   * @param {BoardStructure} board Board on which the towers stand.
   * @param {number} playerNumber Player that can move.
   * @param {number} color Color that can be moved.
   * @return {number} Number of moves that the player can perform
   *                  with the tower of the given color.
   *
   * @memberof Board
   */
  static getDegreesOfFreedomForTower(board, playerNumber, color) {
    const tower = Board.getTowerForPlayerAndColor(board, playerNumber, color);
    const moveDirection = Board.getMoveDirectionFor(playerNumber);
    const y = tower.y;
    const x = tower.x;
    let degreesOfFreedom = 0;

    for (
      let distance = 1, moveStraight = true, moveLeft = true, moveRight = true;
      moveStraight || moveLeft || moveRight;
      distance++
    ) {
      const curY = moveDirection === 1 ? y + distance : y - distance;
      const curXRight = x + distance;
      const curXLeft = x - distance;
      const moveStraight =
        curY <= 7 && curY >= 0 && !Board.coordHasTower(board, x, curY);
      const moveLeft =
        curY <= 7 &&
        curY >= 0 &&
        curXLeft >= 0 &&
        !Board.coordHasTower(board, curXLeft, curY);
      const moveRight =
        curY <= 7 &&
        curY >= 0 &&
        curXRight >= 0 &&
        !Board.coordHasTower(board, curXRight, curY);

      if (moveStraight) {
        degreesOfFreedom++;
      }

      if (moveLeft) {
        degreesOfFreedom++;
      }

      if (moveRight) {
        degreesOfFreedom++;
      }
    }
    return degreesOfFreedom;
  }
}
