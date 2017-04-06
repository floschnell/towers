import Game from './models/Game';
import Board from './models/Board';

const MAX_SCORE = 10000000;

/**
 * 
 * @param {*} from 
 * @param {*} to 
 * @param {Board} board 
 * @param {*} player 
 * @param {*} me 
 * @param {*} iterations 
 */
function rate(from, to, board, player, me, iterations) {
    if (iterations === 0) {
        const result = rateBoard(board, player, to.color, me);
        return {
            from,
            to,
            score: result
        };
    } else {
        let results = rateMoves(board, to.color, player, me, iterations - 1);
        if (results.length === 0) {
            iterations--;
            if (iterations >= 1) {
                const blockedTower = Board.getTowerForPlayerAndColor(board, player, to.color);
                player = Board.getOpponentOf(board, player);
                const blockedTowerFieldColor = Board.getBoardColorAtCoord(blockedTower.x, blockedTower.y);
                results = rateMoves(board, blockedTowerFieldColor, player, me, iterations - 1);
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
            score: results.length > 0 ? results[0].score : rateBoard(board, player, to.color, me, iterations)
        };
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
export function rateMoves(board, currentColor, currentPlayer, me, iterations) {
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
                outcomes.push({
                    to: targetField,
                    from: fromField,
                    score: currentPlayer === me ? MAX_SCORE : -MAX_SCORE
                });
            } else {
                const rating = rate(fromField, targetField, boardCopy, otherPlayer, me, iterations);
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
                outcomes.push({
                    to: targetField,
                    from: fromField,
                    score: currentPlayer === me ? MAX_SCORE : -MAX_SCORE
                });
            } else {
                const rating = rate(fromField, targetField, boardCopy, otherPlayer, me, iterations);
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
                outcomes.push({
                    to: targetField,
                    from: fromField,
                    score: currentPlayer === me ? MAX_SCORE : -MAX_SCORE
                });
            } else {
                const rating = rate(fromField, targetField, boardCopy, otherPlayer, me, iterations);
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
 * @param {Board} board 
 * @param {*} player 
 * @param {*} currentColor 
 * @param {*} me 
 */
function rateBoard(board, player, currentColor, me) {
    let points = 0;
    const moveDirection = Board.getMoveDirectionOf(board, player);
    const targetY = Board.getTargetRowOf(board, player);

    // check all towers
    for (let color = 0; color < 8; color++) {
        const isCurrentColor = color === currentColor;
        const tower = Board.getTowerForPlayerAndColor(board, player, color);
        const y = tower.y;
        const x = tower.x;
        let reachableColors = 0;

        if (player !== me && y === targetY) {
            return -MAX_SCORE;
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
                    points += isCurrentColor ? 10 : 5;
                }
            }

            if (moveLeft) {
                reachableColors |= 1 << Board.getBoardColorAtCoord(curXLeft, curY);
                if (curY === targetY) {
                    points += isCurrentColor ? 10 : 5;
                }
            }
            
            if (moveRight) {
                reachableColors |= 1 << Board.getBoardColorAtCoord(curXRight, curY);
                if (curY === targetY) {
                    points += isCurrentColor ? 10 : 5;
                }
            }
        }

        // tower is blocked
        if (reachableColors === 0) {
            points -= 20;
        } else {
            let count = 0;
            for (; reachableColors > 0; ++count) {
                reachableColors &= reachableColors - 1;
            }
            points += count;
        }
    }

    return (player === me) ? points : -points;
}

export function getDegreesOfFreedomForTower(board, player, color) {
    const tower = Board.getTowerForPlayerAndColor(board, player, color);
    const moveDirection = Board.getMoveDirectionOf(board, player);
    const y = tower.y;
    const x = tower.x;
    let degreesOfFreedom = 0;

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
