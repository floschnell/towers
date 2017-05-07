import Board, {BoardFactory} from './models/Board';
import Game from './models/Game';
import Logger from './logger';

const MAX_SCORE = 10000000;
const boardFactory = new BoardFactory();

/**
 * Game AI implements following strategy:
 * - A tree with all different possibilities will be set up.
 * - subtrees that lead to loss will be eliminated.
 * - The resulting boards (over a certain amount of rounds) will then be
 *   calculated under the assumption that the computer and the human opponent
 *   will always choose the best branch from their own perspective.
 * - The results of branches of the first tree level will then be ordered and the
 *   outcome with the highest score will be chosen.
 */
export default class AI {
  /**
   * Creates a new AI instance.
   *
   * @param {object} options Configures behaviour of the AI.
   */
  constructor({aggressiveness, blockedPenalty, couldFinishBonus}) {
    this.aggressiveness = aggressiveness;
    this.towerIsBlockedPenalty = blockedPenalty;
    this.towerCouldFinishBonus = couldFinishBonus;
  }

  /**
   * This method will rate all different opporunities which there are
   * under given circumstances.
   *
   * @param {BoardStructure} board Current tower positions.
   * @param {number} currentColor The color of the tower that needs to be moved.
   * @param {string} currentPlayer ID of the player who's turn it is.
   * @param {Object} players Object structure containing information on both players.
   * @return {{from: Field, to: Field}}
   */
  getNextMove({board, currentColor, currentPlayer, players}) {
    const boardCopy = boardFactory.copyBoard(board);
    const currentPlayerNumber = Game.getPlayerNumber(
      {players},
      currentPlayer
    );

    // estimate freedom of combinations
    const freedom = [0, 1]
      .map((playerNumber) =>
        [0, 1, 2, 3, 4, 5, 6, 7].map((color) => {
          const moves = Board.getDegreesOfFreedomForTower(
            boardCopy,
            playerNumber,
            color
          );

          return moves;
        })
      )
      .reduce((a, b) => a.concat(b))
      .reduce((a, b) => a + b);

    // choose iterations based on the estimated freedom
    const iterations = 3 + ~~(Math.pow(250 - freedom, 1.8) / 1000);
    Logger.debug('measured freedom:', freedom);
    Logger.debug('chosen number of iterations:', iterations);

    const outcomes = this.rateMoves(
      boardCopy,
      currentColor,
      currentPlayerNumber,
      currentPlayerNumber,
      iterations
    );
    Logger.debug(
      'found',
      outcomes.length,
      'possible moves using',
      iterations,
      'iterations.'
    );

    outcomes.sort((a, b) => (a.score < b.score ? 1 : -1));
    Logger.debug('outcomes:', outcomes);

    // clearing up memory
    boardFactory.dispose();

    if (outcomes.length > 0) {
      return outcomes[0];
    } else {
      return null;
    }
  }

  /**
   * Spans a new subtree with a branch for each choice.
   *
   * @param {Board} board
   * @param {number} currentColor
   * @param {string} currentPlayer
   * @param {string} me
   * @param {number} iterations
   * @return {Array<{from: object, to: object, score: number}>}
   */
  rateMoves(board, currentColor, currentPlayer, me, iterations) {
    const currentTower = Board.getTowerForPlayerAndColor(
      board,
      currentPlayer,
      currentColor
    );
    const otherPlayer = Board.getOpponentFor(currentPlayer);
    const moveDirection = Board.getMoveDirectionFor(currentPlayer);
    const targetY = moveDirection === 1 ? 7 : 0;
    const outcomes = [];
    const fromField = {
      x: currentTower.x,
      y: currentTower.y,
    };

    // where can we move that tower?
    // straight
    for (
      let y = currentTower.y + moveDirection, x = currentTower.x;
      y >= 0 && y <= 7;
      y += moveDirection
    ) {
      const targetField = {
        x,
        y,
      };

      if (!Board.coordHasTower(board, x, y)) {
        const boardCopy = boardFactory.copyBoard(board);
        Board.moveTower(
          boardCopy,
          currentPlayer,
          currentColor,
          currentTower.x,
          currentTower.y,
          x,
          y
        );
        targetField.color = Board.getBoardColorAtCoord(x, y);
        if (targetField.y === targetY) {
          return outcomes.concat({
            from: fromField,
            to: targetField,
            score: currentPlayer === me
              ? MAX_SCORE * iterations
              : -MAX_SCORE * iterations,
          });
        } else {
          const rating = this.rate(
            fromField,
            targetField,
            boardCopy,
            otherPlayer,
            me,
            iterations
          );
          outcomes.push(rating);
        }
      } else {
        break;
      }
    }

    // where can we move that tower?
    // diagonally left
    for (
      let y = currentTower.y + moveDirection, x = currentTower.x - 1;
      y >= 0 && y <= 7 && x >= 0;
      (y += moveDirection), x--
    ) {
      const targetField = {
        x,
        y,
      };

      if (!Board.coordHasTower(board, x, y)) {
        const boardCopy = boardFactory.copyBoard(board);
        Board.moveTower(
          boardCopy,
          currentPlayer,
          currentColor,
          currentTower.x,
          currentTower.y,
          x,
          y
        );
        targetField.color = Board.getBoardColorAtCoord(x, y);
        if (targetField.y === targetY) {
          return outcomes.concat({
            from: fromField,
            to: targetField,
            score: currentPlayer === me
              ? MAX_SCORE * iterations
              : -MAX_SCORE * iterations,
          });
        } else {
          const rating = this.rate(
            fromField,
            targetField,
            boardCopy,
            otherPlayer,
            me,
            iterations
          );
          outcomes.push(rating);
        }
      } else {
        break;
      }
    }

    // where can we move that tower?
    // diagonally right
    for (
      let y = currentTower.y + moveDirection, x = currentTower.x + 1;
      y >= 0 && y <= 7 && x <= 7;
      (y += moveDirection), x++
    ) {
      const targetField = {
        x,
        y,
      };

      if (!Board.coordHasTower(board, x, y)) {
        const boardCopy = boardFactory.copyBoard(board);
        Board.moveTower(
          boardCopy,
          currentPlayer,
          currentColor,
          currentTower.x,
          currentTower.y,
          x,
          y
        );
        targetField.color = Board.getBoardColorAtCoord(x, y);
        if (targetField.y === targetY) {
          return outcomes.concat({
            from: fromField,
            to: targetField,
            score: currentPlayer === me
              ? MAX_SCORE * iterations
              : -MAX_SCORE * iterations,
          });
        } else {
          const rating = this.rate(
            fromField,
            targetField,
            boardCopy,
            otherPlayer,
            me,
            iterations
          );
          outcomes.push(rating);
        }
      } else {
        break;
      }
    }

    return outcomes;
  }

  /**
   * Rates a move's possible sub trees.
   *
   * @param {Field} from
   * @param {Field} to
   * @param {Board} board
   * @param {*} player
   * @param {*} me
   * @param {*} iterations
   * @return {{from: {x: number, y: number}, to: {x: number, y: number}, score: number}}
   */
  rate(from, to, board, player, me, iterations) {
    if (iterations === 0) {
      const result = this.rateBoard(board, player, to.color, me);
      return {
        from,
        to,
        score: result,
      };
    } else {
      let results = this.rateMoves(board, to.color, player, me, iterations - 1);
      if (results.length === 0) {
        iterations--;
        if (iterations >= 1) {
          const blockedTower = Board.getTowerForPlayerAndColor(
            board,
            player,
            to.color
          );
          player = Board.getOpponentFor(player);
          const blockedTowerFieldColor = Board.getBoardColorAtCoord(
            blockedTower.x,
            blockedTower.y
          );
          results = this.rateMoves(
            board,
            blockedTowerFieldColor,
            player,
            me,
            iterations - 1
          );
        }
      }
      if (player === me) {
        results.sort((a, b) => (a.score < b.score ? 1 : -1));
      } else {
        results.sort((a, b) => (a.score > b.score ? 1 : -1));
      }
      return {
        from,
        to,
        score: results.length > 0
          ? results[0].score
          : this.rateBoard(board, player, to.color, me, iterations),
      };
    }
  }

  /**
   * Rates a board in perspective of the active player.
   * This will also regard the standings of the opponent's towers.
   * Taken that the current board gives both players the same chances
   * to win, the rating should be 0.
   *
   * @param {Board} board Current board.
   * @param {string} me ID of the active player.
   * @return {number} Board's score.
   */
  rateBoard(board, me) {
    const opponent = Board.getOpponentFor(me);
    const opponentRating =
      this.aggressiveness * this.rateBoardFor(board, opponent);
    const myRating = (1 - this.aggressiveness) * this.rateBoardFor(board, me);

    return myRating - opponentRating;
  }

  /**
   * Rates the board in perspective of the given player, not regarding
   * the standings of the opponent's towers.
   *
   * @param {Board} board Current board.
   * @param {string} player Player for whom to rate the board for.
   * @return {number} The board's score.
   */
  rateBoardFor(board, player) {
    let points = 0;
    const moveDirection = Board.getMoveDirectionFor(player);
    const targetY = Board.getTargetRowFor(player);

    // check all towers
    for (let color = 0; color < 8; color++) {
      const tower = Board.getTowerForPlayerAndColor(board, player, color);
      const y = tower.y;
      const x = tower.x;
      let reachableColors = 0;

      if (tower.y === targetY) {
        return MAX_SCORE;
      }

      for (
        let distance = 1,
          moveStraight = true,
          moveLeft = true,
          moveRight = true;
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
          reachableColors |= 1 << Board.getBoardColorAtCoord(x, curY);
          if (curY === targetY) {
            points += this.towerCouldFinishBonus;
          }
        }

        if (moveLeft) {
          reachableColors |= 1 << Board.getBoardColorAtCoord(curXLeft, curY);
          if (curY === targetY) {
            points += this.towerCouldFinishBonus;
          }
        }

        if (moveRight) {
          reachableColors |= 1 << Board.getBoardColorAtCoord(curXRight, curY);
          if (curY === targetY) {
            points += this.towerCouldFinishBonus;
          }
        }
      }

      // tower is blocked
      if (reachableColors === 0) {
        points -= this.towerIsBlockedPenalty;
      } else {
        let count = 0;
        for (; reachableColors > 0; ++count) {
          reachableColors &= reachableColors - 1;
        }
        points += count;
      }
    }

    return points;
  }
}
