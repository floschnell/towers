import {ACTION_TYPES} from '../actions/index';
import db from '../database';
import GameLogic, { copyTowers, towerPositionsAreEqual } from '../GameLogic';

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

const createInitialTowerPositions = () => {
    const towers = [[],[]];
    const playerTowers = [];
    for (let player = 0; player < 2; player++) {
        for (let color = 0; color < 8; color++) {
            towers[player].push({
                color,
                belongsToPlayer: player,
                x: player === 0 ? color : 7 - color,
                y: player === 0 ? 0 : 7
            });
        }        
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
        return {
            board: createInitialBoard(initialColors),
            players: [],
            currentPlayer: null,
            currentColor: null,
            selectedTower: null,
            moves: [],
            towerPositions: createInitialTowerPositions()
        };
    }
    
    const newState = JSON.parse(JSON.stringify(state));
    const currentPlayer = state.currentPlayer;
    const currentColor = state.currentColor;
    
    switch (action.type) {
        
        case ACTION_TYPES.CLICK_ON_TOWER:
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
                const currentPlayerNumber = state.players[action.playerUid];

                if (typeof currentColor === 'undefined') {
                    towerToMove = state.selectedTower;
                } else {
                    towerToMove = state.towerPositions[currentPlayerNumber][currentColor];
                }
                
                if (towerToMove.belongsToPlayer === currentPlayerNumber) {
                    const move = {
                        player: currentPlayerNumber,
                        color: towerToMove.color,
                        sourceField: towerToMove,
                        targetField
                    };

                    try {
                        newState.towerPositions = GameLogic.executeMove(state.towerPositions, move);
                        const nextPlayerNumber = (currentPlayerNumber + 1) % 2; 
                        const nextPlayer = Object.keys(state.players).filter(uid => uid !== currentPlayer)[0];
                        const nextColor = targetField.color;

                        if (GameLogic.canMove(newState.towerPositions, nextPlayerNumber, nextColor)) {
                            newState.currentPlayer = nextPlayer;
                            newState.currentColor = nextColor;
                        } else {
                            const blockedTower = newState.towerPositions[nextPlayerNumber][targetField.color];
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
            }
            setTimeout(function () {db.ref(`games/${action.currentGame}`).update(newState)}, 0);
            break;
            
        case ACTION_TYPES.UPDATE_GAME:
            try {
                const initialTowers = createInitialTowerPositions();
                const moves = action.game.moves;
                if (moves && moves.length > 0) {
                    const finalTowers = GameLogic.executeMoves(initialTowers, moves);
                    if (!towerPositionsAreEqual(finalTowers, action.game.towerPositions)) {
                        throw 'Game state is invalid!';
                    }
                }
            } catch (e) {
                alert(e);
                console.error('Game could not be loaded! ', e);
            }
            return action.game;
            
        case ACTION_TYPES.START_GAME:
            const players = {};
            action.players.forEach(
                (uid, index) => players[uid] = index
            );
            const newGameState = {
                players,
                currentPlayer: action.players[0],
                currentColor: null,
                selectedTower: null,
                moves: [],
                board: createInitialBoard(initialColors),
                towerPositions: createInitialTowerPositions()
            };
            setTimeout(function () {db.ref(`games/${action.game}`).update(newGameState)}, 0);
            return newGameState;
            
        default:

    }
    
    return newState;
};