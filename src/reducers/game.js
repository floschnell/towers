import {ACTION_TYPES} from '../actions/index';
import db from '../database';
import GameLogic, { copyTowers, towerPositionsAreEqual } from '../gamelogic';

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

const createInitialTowerPositions = playerUIDs => {
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

const createInitialBoard = (colors) => colors.map((row, index) =>
    row.map(
        color => {
            return {
                color
            }
        }
    )
);

export default (state, action) => {
    
    if (typeof(state) === "undefined") {
        const initialPlayers = { "0": {}, "1": {} };

        return {
            board: createInitialBoard(initialColors),
            players: initialPlayers,
            currentPlayer: null,
            currentColor: null,
            selectedTower: null,
            moves: [],
            towerPositions: createInitialTowerPositions(Object.keys(initialPlayers))
        };
    }
    
    const newState = JSON.parse(JSON.stringify(state));
    const currentPlayer = state.currentPlayer;
    const currentColor = state.currentColor;
    
    switch (action.type) {
        
        case ACTION_TYPES.CLICK_ON_TOWER:
        console.log(currentPlayer, action.playerUid);
            if (currentPlayer === action.playerUid) {
                const towerOnField = action.tower;
                if (typeof state.currentColor === 'undefined' || state.currentColor === null || towerOnField.color === state.currentColor) {
                    newState.selectedTower = action.tower;
                }
            }
            break;
        
        case ACTION_TYPES.CLICK_ON_FIELD:
            if (currentPlayer === action.playerUid) {
                let towerToMove = null;
                const targetField = action.field;

                if (typeof currentColor === 'undefined') {
                    towerToMove = state.selectedTower;
                } else {
                    towerToMove = state.towerPositions[currentPlayer][currentColor];
                }
                
                if (towerToMove.belongsToPlayer === currentPlayer) {
                    const move = {
                        player: currentPlayer,
                        color: towerToMove.color,
                        sourceField: towerToMove,
                        targetField
                    };

                    try {
                        newState.towerPositions = GameLogic.executeMove(state.towerPositions, move);
                        const nextPlayer = Object.keys(state.players).find(uid => uid !== currentPlayer);
                        const nextColor = targetField.color;

                        if (GameLogic.canMove(newState.towerPositions, nextPlayer, nextColor)) {
                            newState.currentPlayer = nextPlayer;
                            newState.currentColor = nextColor;
                        } else {
                            const blockedTower = newState.towerPositions[nextPlayer][targetField.color];
                            const fieldOfBlockedTower = newState.board[blockedTower.y][blockedTower.x];

                            newState.currentColor = fieldOfBlockedTower.color;
                        }
                        newState.selectedTower = null;
                        if (!newState.moves) newState.moves = [];
                        newState.moves.push(move);
                    } catch (e) {
                        console.log('move has failed, resetting ...', e);
                        newState.currentPlayer = currentPlayer;
                        newState.currentColor = currentColor;
                        newState.selectedTower = towerToMove;
                        newState.towerPositions = copyTowers(state.towerPositions);
                    }
                }

                setTimeout(function () {db.ref(`games/${action.currentGame}`).update(newState)}, 0);
            }
            break;
            
        case ACTION_TYPES.UPDATE_GAME:
            try {
                const initialTowers = createInitialTowerPositions(Object.keys(action.game.players));
                const moves = action.game.moves;

                if (moves && moves.length > 0) {
                    const finalTowers = GameLogic.executeMoves(initialTowers, moves);

                    if (!towerPositionsAreEqual(finalTowers, action.game.towerPositions)) {
                        throw 'Game state is invalid!';
                    }
                }

                console.log('new game loaded!');
                return Object.assign({}, action.game);
            } catch (e) {
                alert(e);
                console.error('Game could not be loaded! ', e);
            }
            return state;
            
        case ACTION_TYPES.START_GAME:
            const newGameState = {
                players: action.players,
                currentPlayer: Object.keys(action.players)[0],
                currentColor: null,
                selectedTower: null,
                moves: [],
                board: createInitialBoard(initialColors),
                towerPositions: createInitialTowerPositions(Object.keys(action.players))
            };
            setTimeout(function () {db.ref(`games/${action.game}`).update(newGameState)}, 0);
            return newGameState;
            
        default:

    }
    
    return newState;
};