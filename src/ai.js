import Game from './models/Game';
import Board, {convertTowerPositionsToBoard} from './models/Board';

const MAX_SCORE = 10000000;

export default class AI {

    constructor({towerPositions, currentColor, currentPlayer}, me, {aggressiveness, blockedPenalty, couldFinishBonus}) {
        this.currentColor = currentColor;
        this.currentPlayer = currentPlayer;
        this.me = me;
        this.board = convertTowerPositionsToBoard(towerPositions);
        this.aggressiveness = aggressiveness;
        this.towerIsBlockedPenalty = blockedPenalty;
        this.towerCouldFinishBonus = couldFinishBonus;

         // estimate freedom of combinations
        const freedom = Object.keys(towerPositions).map(player =>
            Object.keys(towerPositions[player]).map(color =>
                Board.getDegreesOfFreedomForTower(this.board, player, color)
            )
        ).reduce(
            (a, b) => a.concat(b)
        ).reduce(
            (a, b) => a + b
        );
        console.debug('measured freedom:', freedom);
        
        // choose iterations based on the estimated freedom
        this.iterations = 3 + ~~((250 - freedom) / 20);
    }

    getNextMove() {
        const outcomes = this.rateMoves(this.board, this.currentColor, this.currentPlayer, this.currentPlayer, this.iterations);
        console.debug('found', outcomes.length, 'possible moves using', this.iterations, 'iterations.');

        outcomes.sort((a, b) => a.score < b.score ? 1 : -1);
        console.debug('outcomes:', outcomes);

        if (outcomes.length > 0) {
            return outcomes[0];
        } else {
            return null;
        }
    }

    /**
     * 
     * @param {Board} board 
     * @param {*} currentColor 
     * @param {*} currentPlayer 
     * @param {*} me 
     * @param {*} iterations 
     */
    rateMoves(board, currentColor, currentPlayer, me, iterations) {
        const currentTower = Board.getTowerForPlayerAndColor(board, currentPlayer, currentColor);
        const otherPlayer = Board.getOpponentOf(board, currentPlayer);
        const moveDirection = Board.getMoveDirectionOf(board, currentPlayer);
        const targetY = moveDirection === 1 ? 7 : 0;
        const outcomes = [];
        const fromField = {
            x: currentTower.x,
            y: currentTower.y
        };

        // where can we move that tower?
        // straight
        for (let y = currentTower.y + moveDirection, x = currentTower.x; y >= 0 && y <= 7; y += moveDirection) {
            const targetField = {
                x,
                y
            };

            if (!Board.coordHasTower(board, x, y)) {
                const boardCopy = Board.copy(board);
                Board.moveTower(boardCopy, currentPlayer, currentColor, currentTower.x, currentTower.y, x, y);
                targetField.color = Board.getBoardColorAtCoord(x, y);
                if (targetField.y === targetY) {
                    return outcomes.concat({
                        from: fromField,
                        to: targetField,
                        score: currentPlayer === me ? MAX_SCORE * iterations : -MAX_SCORE * iterations
                    });
                } else {
                    const rating = this.rate(fromField, targetField, boardCopy, otherPlayer, me, iterations);
                    outcomes.push(rating);
                }
            } else {
                break;
            }
        }

        // where can we move that tower?
        // diagonally left
        for (let y = currentTower.y + moveDirection, x = currentTower.x - 1; y >= 0 && y <= 7 && x >= 0; y += moveDirection, x--) {
            const targetField = {
                x,
                y
            };

            if (!Board.coordHasTower(board, x, y)) {
                const boardCopy = Board.copy(board);
                Board.moveTower(boardCopy, currentPlayer, currentColor, currentTower.x, currentTower.y, x, y);
                targetField.color = Board.getBoardColorAtCoord(x, y);
                if (targetField.y === targetY) {
                    return outcomes.concat({
                        from: fromField,
                        to: targetField,
                        score: currentPlayer === me ? MAX_SCORE * iterations : -MAX_SCORE * iterations
                    });
                } else {
                    const rating = this.rate(fromField, targetField, boardCopy, otherPlayer, me, iterations);
                    outcomes.push(rating);
                }
            } else {
                break;
            }
        }

        // where can we move that tower?
        // diagonally right
        for (let y = currentTower.y + moveDirection, x = currentTower.x + 1; y >= 0 && y <= 7 && x <= 7; y += moveDirection, x++) {
            const targetField = {
                x,
                y
            };

            if (!Board.coordHasTower(board, x, y)) {
                const boardCopy = Board.copy(board);
                Board.moveTower(boardCopy, currentPlayer, currentColor, currentTower.x, currentTower.y, x, y);
                targetField.color = Board.getBoardColorAtCoord(x, y);
                if (targetField.y === targetY) {
                    return outcomes.concat({
                        from: fromField,
                        to: targetField,
                        score: currentPlayer === me ? MAX_SCORE * iterations : -MAX_SCORE * iterations
                    });
                } else {
                    const rating = this.rate(fromField, targetField, boardCopy, otherPlayer, me, iterations);
                    outcomes.push(rating);
                }
            } else {
                break;
            }
        }

        return outcomes;
    }

    /**
     * 
     * @param {*} from 
     * @param {*} to 
     * @param {Board} board 
     * @param {*} player 
     * @param {*} me 
     * @param {*} iterations 
     */
    rate(from, to, board, player, me, iterations) {
        if (iterations === 0) {
            const result = this.rateBoard(board, player, to.color, me);
            return {
                from,
                to,
                score: result
            };
        } else {
            let results = this.rateMoves(board, to.color, player, me, iterations - 1);
            if (results.length === 0) {
                iterations--;
                if (iterations >= 1) {
                    const blockedTower = Board.getTowerForPlayerAndColor(board, player, to.color);
                    player = Board.getOpponentOf(board, player);
                    const blockedTowerFieldColor = Board.getBoardColorAtCoord(blockedTower.x, blockedTower.y);
                    results = this.rateMoves(board, blockedTowerFieldColor, player, me, iterations - 1);
                }
            }
            if (player === me) {
                results.sort((a, b) => a.score < b.score ? 1 : -1);
            } else {
                results.sort((a, b) => a.score > b.score ? 1 : -1);
            }
            return {
                from,
                to,
                score: results.length > 0 ? results[0].score : this.rateBoard(board, player, to.color, me, iterations)
            };
        }
    }

    /**
     * 
     * @param {Board} board 
     * @param {*} player 
     * @param {*} currentColor 
     * @param {*} me 
     */
    rateBoard(board, me) {
        const opponent = Board.getOpponentOf(board, me);
        const opponentRating = this.aggressiveness * this.rateBoardFor(board, opponent);
        const myRating = (1 - this.aggressiveness) * this.rateBoardFor(board, me);

        return myRating - opponentRating;
    }

    rateBoardFor(board, player) {
        let points = 0;
        const moveDirection = Board.getMoveDirectionOf(board, player);
        const targetY = Board.getTargetRowOf(board, player);

        // check all towers
        for (let color = 0; color < 8; color++) {
            const tower = Board.getTowerForPlayerAndColor(board, player, color);
            const y = tower.y;
            const x = tower.x;
            let reachableColors = 0;

            if (tower.y === targetY) {
                return MAX_SCORE;
            }

            for (let distance = 1, moveStraight = true, moveLeft = true, moveRight = true;
                    moveStraight || moveLeft || moveRight;
                    distance++) {
                const curY = moveDirection === 1 ? y + distance : y - distance;
                const curXRight = x + distance;
                const curXLeft = x - distance;
                const moveStraight = curY <= 7 && curY >= 0 && !Board.coordHasTower(board, x, curY);
                const moveLeft = curY <= 7 && curY >= 0 && curXLeft >= 0 && !Board.coordHasTower(board, curXLeft, curY);
                const moveRight = curY <= 7 && curY >= 0 && curXRight >= 0 && !Board.coordHasTower(board, curXRight, curY);

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
