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

function createInitialTowerPositions(playerUIDs) {
    const towers = {
        [playerUIDs[0]]: [],
        [playerUIDs[1]]: []
    };
    const keys = Object.keys(towers).sort((a, b) => a < b ? -1 : 1);

    for (let color = 0; color < 8; color++) {
        towers[keys[0]].push({
            color,
            belongsToPlayer: keys[0],
            x: color,
            y: 0
        });
    }

    for (let color = 0; color < 8; color++) {
        towers[keys[1]].push({
            color,
            belongsToPlayer: keys[1],
            x: 7 - color,
            y: 7
        });
    }

    return towers;
}

// 8 * 3 = 24 bit
const BITS_PER_TOWER = 4;
const BIT_MASK_HAS_TOWER = 8;
const BIT_MASK_COLOR = 7;
const BIT_MASK_FIELD = BIT_MASK_HAS_TOWER | BIT_MASK_COLOR;

export function convertTowerPositionsToBoard(towerPositions) {
    const players = Object.keys(towerPositions);
    const newPositions = [];
    coordToTower = [ 0, 0, 0, 0, 0, 0, 0, 0 ];
    for (let playerNumber = 0; playerNumber < 2; playerNumber++) {
        newPositions[playerNumber] = [];        

        for (let color = 0; color < 8; color++) {
            const tower = towerPositions[players[playerNumber]][color];
            const towerBitMask = (tower.color | BIT_MASK_HAS_TOWER) << (tower.x * BITS_PER_TOWER);

            newPositions[playerNumber][color] = (tower.y << 3) | tower.x;
            coordToTower[tower.y] |= towerBitMask;
        }
    }

    return {
        playerA: players[0],
        playerB: players[1],
        coordToTower: coordToTower,
        playerToColorToTower: newPositions
    };
}

export default class Board {

    static copy(board) {
        const playerToColorToTowerCopy = [];
        for (let i = 0; i < 2; i++) {
            playerToColorToTowerCopy[i] = board.playerToColorToTower[i].slice();
        }
        return {
            playerA: board.playerA,
            playerB: board.playerB,
            playerToColorToTower: playerToColorToTowerCopy,
            coordToTower: board.coordToTower.slice()
        };
    }

    static getOpponentOf(board, player) {
        if (player === board.playerA) {
            return board.playerB;
        } else {
            return board.playerA;
        }
    }

    static getMoveDirectionOf(board, player) {
        if (player > Board.getOpponentOf(board, player)) {
            return -1;
        } else {
            return 1;
        }
    }

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
        const towerToMove = board.playerToColorToTower[playerNumber][color];
        const towerToMoveX = towerToMove & 7;
        const towerToMoveY = towerToMove >>> 3;

        if (towerToMoveX === fromX &&
            towerToMoveY === fromY) {
            
            if (Board.coordHasTower(board, fromX, fromY)) {
                board.playerToColorToTower[playerNumber][color] = (toY << 3) | toX;
                Board._clearFieldBits(board, fromX, fromY);
                Board._setFieldBits(board, toX, toY, color);
                return true;
            }
        }

        throw 'there is no tower that could be moved!';
    }

    static _clearFieldBits(board, x, y) {
        const negatedFieldBits = ~(Board._getFieldBits(board, x, y) << (x * BITS_PER_TOWER));

        board.coordToTower[y] &= negatedFieldBits;
    }

    static _setFieldBits(board, x, y, color) {
        const fieldBits = BIT_MASK_HAS_TOWER | color;

        board.coordToTower[y] |= fieldBits << (x * BITS_PER_TOWER);
    }

    static _getFieldBits(board, x, y) {
        const shift = x * BITS_PER_TOWER;

        return (board.coordToTower[y] & (BIT_MASK_FIELD << shift)) >>> shift;
    }

    static getTowerForPlayerAndColor(board, player, color) {
        const playerNumber = player === board.playerA ? 0 : 1;
        const tower = board.playerToColorToTower[playerNumber][color];

        return {
            x: tower & 7,
            y: tower >>> 3
        };
    }

    static coordHasTower(board, x, y) {
        return (Board._getFieldBits(board, x, y) & BIT_MASK_HAS_TOWER) === BIT_MASK_HAS_TOWER;
    }

    static getTowerColorAtCoord(board, x, y) {
        if (Board.coordHasTower(board, x, y)) {
            return Board._getFieldBits(board, x, y) & BIT_MASK_COLOR;
        } else {
            return null;
        }
    }

    static getBoardColorAtCoord(x, y) {
        return boardColors[y][x];
    }

    static _lpad(padString, length) {
        var str = this;
        while (str.length < length)
            str = padString + str;
        return str;
    }

    static printBoard(board) {
        for (const y in board.coordToTower) {
            const rowString = Board._lpad.bind((board.coordToTower[y] >>> 0).toString(2), '0', 8 * BITS_PER_TOWER)();
            const fields = rowString.match(new RegExp(`(.{1,${BITS_PER_TOWER}})`, 'g')).reverse();

            console.log(`${y}:`, fields);
        }
    }
}

if (false) {
    const towerPositions = createInitialTowerPositions(['player', 'computer']);
    const board = convertTowerPositionsToBoard(towerPositions);

    Board.printBoard(board);
    console.log('0,0:', Board.coordHasTower(board, 0, 0));
    console.log('3,3:', Board.coordHasTower(board, 3, 3));
    console.log('7,0:', Board.coordHasTower(board, 7, 0));
    console.log('0,7:', Board.coordHasTower(board, 0, 7));
    console.log('7,7:', Board.coordHasTower(board, 7, 7));

    console.log('move: ', Board.moveTower(board, 'computer', 3, 3, 0, 3, 3));
    Board.printBoard(board);
    console.log('3,3:', Board.coordHasTower(board, 3, 3));
    console.log('move: ', Board.moveTower(board, 'computer', 3, 3, 3, 3, 0));
    Board.printBoard(board);

    console.log('benchmarking coordHasTower():');
    console.time('coordHasTower');
    for (let i = 0; i < 1000000; i++) {
        Board.coordHasTower(board, i + 4 % 8, i % 8);
    }
    const end = Date.now();
    console.timeEnd('coordHasTower');

    console.log('benchmarking copy():');
    console.time('copy');
    for (let i = 0; i < 1000000; i++) {
        const boardCopy = Board.copy(board);
    }
    console.timeEnd('copy');

    console.log('benchmarking getTowerForPlayerAndColor():');
    console.time('getTowerForPlayerAndColor');
    for (let i = 0; i < 1000000; i++) {
        Board.getTowerForPlayerAndColor(board, 'computer', 4);
    }
    console.timeEnd('getTowerForPlayerAndColor');

    console.log('benchmarking moveTower():');
    console.time('moveTower');
    for (let i = 0; i < 1000000; i++) {
        const fromX = 3;
        const fromY = 0;
        const toX = 3;
        const toY = 3;

        Board.moveTower(board, 'computer', 3, fromX, fromY, toX, toY);
        Board.moveTower(board, 'computer', 3, toX, toY, fromX, fromY);
    }
    console.timeEnd('moveTower');

    console.log('benchmarking getOpponentOf():');
    console.time('getOpponentOf');
    for (let i = 0; i < 1000000; i++) {
        Board.getOpponentOf(board, 'computer');
        Board.getOpponentOf(board, 'player');
    }
    console.timeEnd('getOpponentOf');
}
