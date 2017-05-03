import Logger from '../logger';

const boardColors = [
  [0, 1, 2, 3, 4, 5, 6, 7],
  [5, 0, 3, 6, 1, 4, 7, 2],
  [6, 3, 0, 5, 4, 7, 2, 1],
  [3, 2, 1, 0, 7, 6, 5, 4],
  [4, 5, 6, 7, 0, 1, 2, 3],
  [1, 2, 7, 4, 5, 0, 3, 6],
  [2, 7, 4, 1, 6, 3, 0, 5],
  [7, 6, 5, 4, 3, 2, 1, 0],
];

const BOARD_SIZE_IN_BYTES = 80;
const REALLOC_BATCH_EXP = 12; // that means, we will allocate 320 kb batches
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
   * Copies a board into a new memory location.
   *
   * @param {{playerA: string, playerB: string, data: ArrayBuffer}} board Board to copy.
   * @return {{playerA: string, playerB: string, data: ArrayBuffer}}
   */
  copyBoard(board) {
    // allocate a new memory batch if needed
    if (this.size >= this.available) {
      Logger.debug('reallocating new memory. (', this.size, '>=', this.available, ')');
      this.currentBufferWindow = new ArrayBuffer(
        REALLOC_BATCH_SIZE * BOARD_SIZE_IN_BYTES
      );
      this.buffers.push(this.currentBufferWindow);
      this.available += REALLOC_BATCH_SIZE;
      this.currentBufferWindowPosition = 0;
    }
    // create view on memory fragment
    const data = new Uint8Array(
      this.currentBufferWindow,
      this.currentBufferWindowPosition,
      BOARD_SIZE_IN_BYTES
    );
    data.set(board.data);
    this.size++;
    this.currentBufferWindowPosition += BOARD_SIZE_IN_BYTES;
    return {
      playerA: board.playerA,
      playerB: board.playerB,
      data,
    };
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
 * @typedef BoardStructure
 * @property {string} playerA
 * @property {string} playerB
 * @property {ArrayBuffer} data
 */

/**
 * This is an abstraction of the database model.
 */
export default class Board {
  /**
   * Converts the database's data structure into a structure that is
   * optimized for processing certain operations like:
   * copying or querying tower positions.
   *
   * @param {object} towerPositions Database model.
   * @return {BoardStructure}
   * The optimized data structure.
   */
  static convertTowerPositionsToBoard(towerPositions) {
    const players = Object.keys(towerPositions);
    const data = new Uint8Array(80);
    for (let playerNumber = 0; playerNumber < 2; playerNumber++) {
      for (let color = 0; color < 8; color++) {
        const tower = towerPositions[players[playerNumber]][color];

        data[playerNumber * 8 + color] = (tower.y << 3) | tower.x;
        data[tower.y * 8 + tower.x + 16] = tower.color + 1;
      }
    }

    return {
      playerA: players[0],
      playerB: players[1],
      data,
    };
  }

  /**
   * Retrieves the player's opponent in the give game.
   *
   * @param {BoardStructure} board The game board.
   * @param {string} player The player's name.
   * @return {string} The opponent's name.
   */
  static getOpponentOf(board, player) {
    if (player === board.playerA) {
      return board.playerB;
    } else {
      return board.playerA;
    }
  }

  /**
   * Retrieves the player's move direction on the given board.
   *
   * @param {BoardStructure} board The game board.
   * @param {string} player The player's name.
   * @return {number} The move direction: 1 for downwards and -1 for upwards.
   */
  static getMoveDirectionOf(board, player) {
    if (player > Board.getOpponentOf(board, player)) {
      return -1;
    } else {
      return 1;
    }
  }

  /**
   * Retrieves the player's target row on the given board.
   * Target row is the starting row of the opponent at the same time.
   *
   * @param {BoardStructure} board The game board.
   * @param {string} player The player's name.
   * @return {number} The target row which is either 0 or 7.
   */
  static getTargetRowOf(board, player) {
    if (player > Board.getOpponentOf(board, player)) {
      return 0;
    } else {
      return 7;
    }
  }

  /**
   *
   * @param {String} player
   * @param {Number} color
   * @param {{x: Number, y: Number}} from
   * @param {{x: Number, y: Number}} to
   */
  static moveTower(board, player, color, fromX, fromY, toX, toY) {
    const playerNumber = player === board.playerA ? 0 : 1;
    const playerColorIndex = playerNumber * 8 + color;
    const towerToMove = board.data[playerColorIndex];
    const towerToMoveX = towerToMove & 7;
    const towerToMoveY = towerToMove >>> 3;

    if (towerToMoveX === fromX && towerToMoveY === fromY) {
      if (Board.coordHasTower(board, fromX, fromY)) {
        board.data[playerColorIndex] = (toY << 3) | toX;
        board.data[fromY * 8 + fromX + 16] = 0;
        board.data[toY * 8 + toX + 16] = color + 1;
        return true;
      }
    }

    throw new Error('there is no tower that could be moved!');
  }

  static getTowerForPlayerAndColor(board, player, color) {
    const playerNumber = player === board.playerA ? 0 : 1;
    const tower = board.data[playerNumber === 1 ? 8 + color : color];

    return {
      x: tower & 7,
      y: tower >> 3,
    };
  }

  static coordHasTower(board, x, y) {
    return board.data[y * 8 + x + 16] > 0;
  }

  static getTowerColorAtCoord(board, x, y) {
    const color = board.data[y * 8 + x + 16];
    if (color > 0) {
      return color - 1;
    } else {
      return null;
    }
  }

  static getBoardColorAtCoord(x, y) {
    return boardColors[y][x];
  }

  static printBoard(board) {
    for (let y = 0; y < 8; y++) {
      let row = '[';
      for (let x = 0; x < 8; x++) {
        row += board.data[y * 8 + x + 16] + ',';
      }
      console.log(row + ']');
    }
  }

  static getDegreesOfFreedomForTower(board, player, color) {
    const tower = Board.getTowerForPlayerAndColor(board, player, color);
    const moveDirection = Board.getMoveDirectionOf(board, player);
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

Board.buffers = new ArrayBuffer(80 * 1000);
Board.count = 0;
