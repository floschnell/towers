import Game from './models/Game';
import GameLogic, { copyTowers, fieldsAreEqual, fieldHasTower, playerMoveDirection } from './gamelogic';

const MAX_SCORE = 10000000;
const board = Game.createInitialBoard();

function rate(from, to, towers, player, me, iterations) {
    if (iterations === 0) {
        const result = rateBoard(towers, player, to.color, me);
        return {
            from,
            to,
            score: result
        };
    } else {
        let results = rateMoves(towers, to.color, player, me, iterations - 1);
        if (results.length === 0) {
            iterations--;
            if (iterations >= 1) {
                const blockedTower = towers[player][to.color];
                const otherPlayer = Object.keys(towers).find(id => id !== player);
                const blockedTowerFieldColor = board[blockedTower.y][blockedTower.x].color;
                results = rateMoves(towers, blockedTowerFieldColor, otherPlayer, me, iterations - 1);
            }
        }
        if (iterations % 2 === 0) {
            results.sort((a, b) => a.score > b.score ? 1 : -1);
        } else {
            results.sort((a, b) => a.score < b.score ? 1 : -1);
        }
        return {
            from,
            to,
            score: results.length > 0 ? results[0].score : rateBoard(towers, player, to.color, me, iterations)
        };
    }
}

export function rateMoves(towers, currentColor, currentPlayer, me, iterations, results) {
    const currentTower = towers[currentPlayer][currentColor];
    const otherPlayer = Object.keys(towers).find(player => player !== currentPlayer);
    const moveDirection = playerMoveDirection(currentPlayer, Object.keys(towers));
    const targetY = moveDirection === 1 ? 7 : 0;
    const outcomes = [];
    const fromField = {
        x: towers[currentPlayer][currentColor].x,
        y: towers[currentPlayer][currentColor].y
    };

    // where can we move that tower?
    // straight
    for (let y = currentTower.y + moveDirection, x = currentTower.x; y >= 0 && y <= 7; y += moveDirection) {
        const targetField = {
            x,
            y
        };

        if (!fieldHasTower(towers, targetField)) {
            const copyOfTowers = copyTowers(towers);
            copyOfTowers[currentPlayer][currentColor].y = y;
            targetField.color = board[y][x].color;
            if (targetField.y === targetY && iterations === 4) {
                outcomes.push({
                    to: targetField,
                    from: fromField,
                    score: MAX_SCORE
                });
            } else {
                const rating = rate(fromField, targetField, copyOfTowers, otherPlayer, me, iterations);
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

        if (!fieldHasTower(towers, targetField)) {
            const copyOfTowers = copyTowers(towers);
            copyOfTowers[currentPlayer][currentColor].y = y;
            copyOfTowers[currentPlayer][currentColor].x = x;
            targetField.color = board[y][x].color;
            if (targetField.y === targetY && iterations === 4) {
                outcomes.push({
                    to: targetField,
                    from: fromField,
                    score: MAX_SCORE
                });
            } else {
                const rating = rate(fromField, targetField, copyOfTowers, otherPlayer, me, iterations);
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

        if (!fieldHasTower(towers, targetField)) {
            const copyOfTowers = copyTowers(towers);
            copyOfTowers[currentPlayer][currentColor].y = y;
            copyOfTowers[currentPlayer][currentColor].x = x;
            targetField.color = board[y][x].color;
            if (targetField.y === targetY && iterations === 4) {
                outcomes.push({
                    to: targetField,
                    from: fromField,
                    score: MAX_SCORE
                });
            } else {
                const rating = rate(fromField, targetField, copyOfTowers, otherPlayer, me, iterations);
                outcomes.push(rating);
            }
        } else {
            break;
        }
    }

    return outcomes;
}

function rateBoard(towers, player, currentColor, me) {
    let points = 0;

    // check all towers
    for (let color = 0; color < 8; color++) {
        const isCurrentColor = color === currentColor;
        const moveDirection = playerMoveDirection(player, Object.keys(towers));
        const targetY = moveDirection === 1 ? 7 : 0;
        const tower = towers[player][color];
        const y = tower.y;
        const x = tower.x;

        if (player !== me && y === targetY) {
            return -MAX_SCORE;
        }

        for (let curY = y + moveDirection; curY >= 0 && curY <= 7; curY += moveDirection) {
            if (!fieldHasTower(towers, { x, y: curY })) {
                points++;
                if (curY === targetY) {
                    points += isCurrentColor ? 20 : 10;
                }
            }
        }

        for (let curY = y + moveDirection, curX = x + 1; curY >= 0 && curY <= 7 && curX <= 7; curY += moveDirection, curX++) {
            if (!fieldHasTower(towers, { x: curX, y: curY })) {
                points++;
                if (curY === targetY) {
                    points += isCurrentColor ? 20 : 10;
                }
            }
        }

        for (let curY = y + moveDirection, curX = x - 1; curY >= 0 && curY <= 7 && curX <= 7; curY += moveDirection, curX--) {
            if (!fieldHasTower(towers, { x: curX, y: curY })) {
                points++;
                if (curY === targetY) {
                    points += isCurrentColor ? 20 : 10;
                }
            }
        }
    }

    return (player === me) ? points : -points;
}
