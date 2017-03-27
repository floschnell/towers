import Game from './models/Game';
import GameLogic, { copyTowers, fieldsAreEqual, fieldHasTower, playerMoveDirection } from './gamelogic';

export function rateMoves(towers, currentColor, currentPlayer, me, iterations, results) {
    const board = Game.createInitialBoard();
    const currentTower = towers[currentPlayer][currentColor];
    const moveDirection = playerMoveDirection(currentPlayer, Object.keys(towers));
    const targetY = moveDirection === 1 ? 7 : 0;
    let sum = 0;

    // where can we move that tower?
    // straight
    for (let y = currentTower.y + moveDirection, x = currentTower.x; y !== targetY; y += moveDirection) {
        const targetField = {
            x,
            y
        };

        if (!fieldHasTower(towers, targetField)) {
            const copyOfTowers = copyTowers(towers);
            const fromY = copyOfTowers[currentPlayer][currentColor].y;
            copyOfTowers[currentPlayer][currentColor].y = y;

            if (iterations > 0) {
                let score = 0;
                const otherPlayer = Object.keys(towers).find(player => player !== currentPlayer);
                const color = board[y][x].color;

                // if we move here, what could happen to us?
                score += rateBoard(copyOfTowers, otherPlayer, color, me, iterations);

                score += rateMoves(copyOfTowers, color, otherPlayer, me, iterations - 1);
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
            }
        } else {
            break;
        }
    }

    // where can we move that tower?
    // diagonally left
    for (let y = currentTower.y + moveDirection, x = currentTower.x - 1; y !== targetY && x >= 0; y += moveDirection, x--) {
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
            
            if (iterations > 0) {
                const otherPlayer = Object.keys(towers).find(player => player !== currentPlayer);
                const color = board[y][x].color;
                let score = 0;

                score += rateBoard(copyOfTowers, otherPlayer, color, me, iterations);
                score += rateMoves(copyOfTowers, color, otherPlayer, me, iterations - 1);
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
            }
        } else {
            break;
        }
    }

    // where can we move that tower?
    // diagonally right
    for (let y = currentTower.y + moveDirection, x = currentTower.x + 1; y !== targetY && x <= 7; y += moveDirection, x++) {
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
            
            if (iterations > 0) {
                const otherPlayer = Object.keys(towers).find(player => player !== currentPlayer);
                const color = board[y][x].color;
                let score = 0;

                score += rateBoard(copyOfTowers, otherPlayer, color, me, iterations);
                score += rateMoves(copyOfTowers, color, otherPlayer, me, iterations - 1);
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
            }
        } else {
            break;
        }
    }
    return sum;
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
        let multiplier = color === currentColor ? 7 : 1;
        if (player !== me) {
            multiplier = color === currentColor ? -100 : -1;
        }
        if (iteration === 4) {
            console.debug('multi', multiplier);
        }
        points += couldTowerFinish(towers, color, player) * multiplier * Math.pow(iteration, 3);
    }
    
    if (iteration === 4) {
        console.debug('player', player, 'color', currentColor, 'me', me, 'points', points);
    }
    return points;
}
