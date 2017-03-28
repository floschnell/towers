import Game from './models/Game';
import GameLogic, { copyTowers, fieldsAreEqual, fieldHasTower, playerMoveDirection } from './gamelogic';

export function rateMoves(towers, currentColor, currentPlayer, me, iterations, results) {
    if (iterations === 0) return 0;
    
    const board = Game.createInitialBoard();
    const currentTower = towers[currentPlayer][currentColor];
    const moveDirection = playerMoveDirection(currentPlayer, Object.keys(towers));
    const targetY = moveDirection === 1 ? 7 : 0;
    let sum = 0;
    let moveCount = 0;

    // where can we move that tower?
    // straight
    for (let y = currentTower.y + moveDirection, x = currentTower.x; y <= 7 && y >= 0; y += moveDirection) {
        const targetField = {
            x,
            y
        };

        if (!fieldHasTower(towers, targetField)) {
            const copyOfTowers = copyTowers(towers);
            const fromX = copyOfTowers[currentPlayer][currentColor].x;
            const fromY = copyOfTowers[currentPlayer][currentColor].y;
            copyOfTowers[currentPlayer][currentColor].y = y;
            const otherPlayer = Object.keys(towers).find(player => player !== currentPlayer);
            const color = board[y][x].color;

            // if we move here, what could happen to us?
            const boardRate = rateBoard(copyOfTowers, otherPlayer, color, me, iterations);
            let score = boardRate;

            const movesRate = rateMoves(copyOfTowers, color, otherPlayer, me, iterations - 1);
            score += movesRate;

            if (results) {
                results.push({
                    from: {
                        x,
                        y: fromY
                    },
                    to: {
                        x,
                        y,
                        color
                    },
                    score: score
                });
            }
            sum += score;
            moveCount++;
        } else {
            break;
        }
    }

    // where can we move that tower?
    // diagonally left
    for (let y = currentTower.y + moveDirection, x = currentTower.x - 1; y <= 7 && y >= 0 && x >= 0 && x <= 7; y += moveDirection, x--) {
        const targetField = {
            x,
            y
        };

        if (!fieldHasTower(towers, targetField)) {
            const copyOfTowers = copyTowers(towers);
            const fromX = copyOfTowers[currentPlayer][currentColor].x;
            const fromY = copyOfTowers[currentPlayer][currentColor].y;
            copyOfTowers[currentPlayer][currentColor].y = y;
            copyOfTowers[currentPlayer][currentColor].x = x;
            const otherPlayer = Object.keys(towers).find(player => player !== currentPlayer);
            const color = board[y][x].color;
            let score = 0;

            // if we move here, what could happen to us?
            const boardRate = rateBoard(copyOfTowers, otherPlayer, color, me, iterations);
            score += boardRate;

            const movesRate = rateMoves(copyOfTowers, color, otherPlayer, me, iterations - 1);
            score += movesRate;

            if (results) {
                results.push({
                    from: {
                        x: fromX,
                        y: fromY
                    },
                    to: {
                        x,
                        y,
                        color
                    },
                    score: score
                });
            }
            sum += score;
            moveCount++;
        } else {
            break;
        }
    }

    // where can we move that tower?
    // diagonally right
    for (let y = currentTower.y + moveDirection, x = currentTower.x + 1; y <= 7 && y >= 0 && x >= 0 && x <= 7; y += moveDirection, x++) {
        const targetField = {
            x,
            y
        };

        if (!fieldHasTower(towers, targetField)) {
            const copyOfTowers = copyTowers(towers);
            const fromX = copyOfTowers[currentPlayer][currentColor].x;
            const fromY = copyOfTowers[currentPlayer][currentColor].y;
            copyOfTowers[currentPlayer][currentColor].y = y;
            copyOfTowers[currentPlayer][currentColor].x = x;
            const otherPlayer = Object.keys(towers).find(player => player !== currentPlayer);
            const color = board[y][x].color;
            let score = 0;

            // if we move here, what could happen to us?
            const boardRate = rateBoard(copyOfTowers, otherPlayer, color, me, iterations);
            score += boardRate;

            const movesRate = rateMoves(copyOfTowers, color, otherPlayer, me, iterations - 1);
            score += movesRate;

            if (results) {
                results.push({
                    from: {
                        x: fromX,
                        y: fromY
                    },
                    to: {
                        x,
                        y,
                        color
                    },
                    score: score
                });
            }
            sum += score;
            moveCount++;
        } else {
            break;
        }
    }
    if (moveCount > 0) {
        return sum / moveCount;
    } else {
        return 0;
    }
}

function couldTowerFinish(towers, color, player) {
    const moveDirection = playerMoveDirection(player, Object.keys(towers));
    const targetY = moveDirection === 1 ? 7 : 0;
    const distance = Math.abs(targetY - towers[player][color].y);
    const leftReachable = towers[player][color].x - distance >= 0;
    const rightReachable = towers[player][color].x + distance <= 7;
    let points = 0;

    if (leftReachable) {
        const fieldLeft = {
            x: towers[player][color].x - distance,
            y: targetY
        };
        points += GameLogic._obstacleOnWay(towers, towers[player][color], fieldLeft, -1, moveDirection) ? 0 : 1;
    }

    if (rightReachable) {
        const fieldRight = {
            x: towers[player][color].x + distance,
            y: targetY
        };
        points += GameLogic._obstacleOnWay(towers, towers[player][color], fieldRight, 1, moveDirection) ? 0 : 1;
    }

    const fieldAhead = {
        x: towers[player][color].x,
        y: targetY
    };
    points += GameLogic._obstacleOnWay(towers, towers[player][color], fieldAhead, 0, moveDirection) ? 0 : 1;
    return points;
}

function rateBoard(towers, player, currentColor, me, iteration) {
    let points = 0;

    // check all towers
    for (let color = 0; color < 8; color++) {
        const isCurrentColor = color === currentColor;
        

        const moveDirection = playerMoveDirection(player, Object.keys(towers));
        const targetY = moveDirection === 1 ? 7 : 0;
        const hasTowerFinished = towers[player][color].y === targetY;
        if (hasTowerFinished && player === me) {
            return 1000000;
        } else if (hasTowerFinished && player !== me) {
            return -1000000;
        }

        const howOftenCouldTowerFinish = couldTowerFinish(towers, color, player);

        // if this is me
        if (player === me) {
            if (isCurrentColor) {
                if (iteration === 4) {
                    points += howOftenCouldTowerFinish * 10000;
                } else {
                    points += howOftenCouldTowerFinish * 100;
                }
            } else {
                points += howOftenCouldTowerFinish;
            }
        // if this is the opponent
        } else {
            if (isCurrentColor) {
                points += howOftenCouldTowerFinish * -1000;
            } else {
                points += howOftenCouldTowerFinish * -10;
            }
        }
    }

    if (iteration === 4) {
        return points;
    } else if (iteration === 3) {
        return points;
    } else if (iteration === 2) {
        return points / 2;
    } else {
        return points / 2;
    }
}
