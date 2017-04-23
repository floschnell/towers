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

const BITS_PER_TOWER = 4;
const BIT_MASK_HAS_TOWER = 8;
const BIT_MASK_COLOR = 7;
const BIT_MASK_FIELD = BIT_MASK_HAS_TOWER | BIT_MASK_COLOR;

export function convertTowerPositionsToBoard(towerPositions) {
    const players = Object.keys(towerPositions);
    const newPositions = [];
    for (let playerNumber = 0; playerNumber < 2; playerNumber++) {
        newPositions[playerNumber] = towerPositions[players[playerNumber]];
    }
    return new Board(newPositions, players);
}

export default class Board {

    /**
     * Creates a new board instance.
     *
     * @param {{x: integer, y: integer, color: integer, belongsToPlayer: string}[][]} towerPositions Data structure containing the towers.
     */
    constructor(towerPositions, players) {
        this.coordToTower = [ 0, 0, 0, 0, 0, 0, 0, 0 ];
        this.playerToColorToTower = [];
        this.players = players;

        for (let player = 0; player < 2; player++) {
            this.playerToColorToTower[player] = [];

            for (let color = 0; color < 8; color++) {
                const tower = towerPositions[player][color];

                this.playerToColorToTower[player][color] = {
                    x: tower.x,
                    y: tower.y,
                    belongsToPlayer: tower.belongsToPlayer,
                    color: tower.color
                };
                const towerBitMask = (tower.color | BIT_MASK_HAS_TOWER) << (tower.x * BITS_PER_TOWER);
                this.coordToTower[tower.y] |= towerBitMask;
            }
        }
    }

    copy() {
        return new Board(this.playerToColorToTower, this.players);
    }

    getPlayers() {
        return this.players;
    }

    getOpponentOf(player) {
        return this.players.indexOf(player) === 1 ? this.players[0] : this.players[1];
    }

    getMoveDirectionOf(player) {
        if (player > this.getOpponentOf(player)) {
            return -1;
        } else {
            return 1;
        }
    }

    getTargetRowOf(player) {
        if (player > this.getOpponentOf(player)) {
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
    moveTower(player, color, from, to) {
        const playerNumber = this.players.indexOf(player);
        const towerToMove = this.playerToColorToTower[playerNumber][color];

        if (towerToMove.x === from.x &&
            towerToMove.y === from.y) {
            
            if (this.coordHasTower(from.x, from.y)) {
                this.playerToColorToTower[playerNumber][color].x = to.x;
                this.playerToColorToTower[playerNumber][color].y = to.y;
                this._clearFieldBits(from.x, from.y);
                this._setFieldBits(to.x, to.y, color);
                return true;
            }
        }

        throw 'there is no tower that could be moved!';
    }

    _clearFieldBits(x, y) {
        const negatedFieldBits = ~this._getFieldBits(x, y);
        const restMask = (1 << (x * BITS_PER_TOWER)) - 1;

        this.coordToTower[y] &= (negatedFieldBits << (x * BITS_PER_TOWER)) | restMask;
    }

    _setFieldBits(x, y, color) {
        const fieldBits = BIT_MASK_HAS_TOWER | color;

        this.coordToTower[y] |= fieldBits << (x * BITS_PER_TOWER);
    }

    _getFieldBits(x, y) {
        const shift = x * BITS_PER_TOWER;

        return (this.coordToTower[y] & (BIT_MASK_FIELD << shift)) >>> shift;
    }

    getTowerForPlayerAndColor(player, color) {
        const playerNumber = this.players.indexOf(player);

        return this.playerToColorToTower[playerNumber][color];
    }

    coordHasTower(x, y) {
        return (this._getFieldBits(x, y) & BIT_MASK_HAS_TOWER) === BIT_MASK_HAS_TOWER;
    }

    getTowerColorAtCoord(x, y) {
        if (this.coordHasTower(x, y)) {
            return this._getFieldBits(x, y) & BIT_MASK_COLOR;
        } else {
            return null;
        }
    }

    getBoardColorAtCoord(x, y) {
        return boardColors[y][x];
    }

    _lpad = function(padString, length) {
        var str = this;
        while (str.length < length)
            str = padString + str;
        return str;
    }

    printBoard() {
        for (const y in this.coordToTower) {
            const rowString = this._lpad.bind((this.coordToTower[y] >>> 0).toString(2), '0', 8 * BITS_PER_TOWER)();
            const fields = rowString.match(new RegExp(`(.{1,${BITS_PER_TOWER}})`, 'g')).reverse();

            console.log(`${y}:`, fields);
        }
    }

    static getDegreesOfFreedomForTower(board, player, color) {
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
}
