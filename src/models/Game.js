import Player from './Player';

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
}
