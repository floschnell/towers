import Player from './Player';

const initialColors = [
    [0, 1, 2, 3, 4, 5, 6, 7],
    [5, 0, 3, 6, 1, 4, 7, 2],
    [6, 3, 0, 5, 4, 7, 2, 1],
    [3, 2, 1, 0, 7, 6, 5, 4],
    [4, 5, 6, 7, 0, 1, 2, 3],
    [1, 2, 7, 4, 5, 0, 3, 6],
    [2, 7, 4, 1, 6, 3, 0, 5],
    [7, 6, 5, 4, 3, 2, 1, 0],
];

export default class Game {

    constructor() {

        /**
         * @type{Object.<String, Player>}
         */
        this.players = {};
        this.currentColor = 0;
        this.currentPlayer = '';
        this.moves = [];
        this.board = [[]];
        this.towerPositions = [[]];
    }

    /**
     * @static
     * @param {Game} game 
     * @returns {String} Key of the game that was passed.
     */
    static getKey(game) {
        const playerUIDs = Object.keys(game.players);
        const playerA = playerUIDs[0];
        const playerB = playerUIDs[1];

        if (playerA < playerB) {
            return `${playerA}-${playerB}`;
        } else {
            return `${playerB}-${playerA}`;
        }
    }

    /**
     * @static
     * @param {Game} game
     * @param {String} playerUID 
     * @returns {Player}
     * 
     * @memberOf Game
     */
    static getPlayer(game, playerUID) {
        return game.players[playerUID];
    }

    /**
     * @static
     * @param {Game} game
     * @param {String} playerUID 
     * @returns {Player}
     * 
     * @memberOf Game
     */
    static getOpponent(game, playerUID) {
        const opponentUID = Game.getOpponentUID(game, playerUID);

        return game.players[opponentUID];
    }

    static getOpponentUID(game, playerUID) {
        return Object.keys(game.players).find(uid => uid !== playerUID);
    }

    static createInitialTowerPositions(playerUIDs) {
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

    static createInitialBoard() {
        return initialColors.map((row, index) =>
            row.map(
                color => {
                    return {
                        color
                    }
                }
            )
        );
    }
}
