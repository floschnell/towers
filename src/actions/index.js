import db from '../database';
import { createInitialBoard, createInitialTowerPositions, initialColors, getGameKey } from '../reducers/game';
import {Actions, ActionConst} from 'react-native-router-flux';

export const ACTION_TYPES = {
    CLICK_ON_TOWER: 'CLICK_ON_TOWER',
    CLICK_ON_FIELD: 'CLICK_ON_FIELD',
    SET_PLAYER: 'SET_PLAYER',
    UPDATE_GAMES: 'UPDATE_GAMES',
    RESUME_GAME: 'RESUME_GAME',
    START_GAME: 'START_GAME',
    UPDATE_GAME: 'UPDATE_GAME',
    UPDATE_PLAYERS: 'UPDATE_PLAYERS',
    END_GAME: 'END_GAME',
    RESIZE_GAME_SURFACE: 'RESIZE_GAME_SURFACE'
};

export const clickOnTower = (tower, playerUid, currentGame) => ({
    type: ACTION_TYPES.CLICK_ON_TOWER,
    tower,
    playerUid,
    currentGame
});

export const clickOnField = (field, playerUid, currentGame) => ({
    type: ACTION_TYPES.CLICK_ON_FIELD,
    field,
    playerUid,
    currentGame
});

export const setPlayer = (player, user) => ({
    type: ACTION_TYPES.SET_PLAYER,
    player,
    user
});

export const updateGames = games => ({
    type: ACTION_TYPES.UPDATE_GAMES,
    games
});

export const resumeGame = game => ({
    type: ACTION_TYPES.RESUME_GAME,
    game
});

export const gameStarted = game => ({
    type: ACTION_TYPES.START_GAME,
    game
});

export function startGame(playerUID, opponentUID, players) {
    return dispatch => {
        const newGame = {
            players,
            currentPlayer: Object.keys(players)[0],
            moves: [],
            board: createInitialBoard(initialColors),
            towerPositions: createInitialTowerPositions(Object.keys(players))
        };

        const gameName = getGameKey(newGame);
        const playerRef = db.ref(`players/${playerUID}`);
        const opponentRef = db.ref(`players/${opponentUID}`);
        const gameRef = db.ref(`games/${gameName}`);

        return Promise.all([
            opponentRef.once('value'),
            playerRef.once('value'),
            gameRef.once('value')
        ]).then(results => {
            const opponent = results[0];
            const player = results[1];
            const game = results[2];
            const updatePlayerGames = gamesObj => {
                gamesObj = gamesObj || [];
                gamesObj.push(gameName);
                return gamesObj;
            };

            if (!opponent.exists()) {
                throw 'Opponent does not exist in database!';
            }
            if (!player.exists()) {
                throw 'Player does not exist in database!';
            }
            if (game.exists()) {
                throw 'Game exists already!';
            }

            gameRef.set(newGame).then(() => Promise.all([
                db.ref(`players/${playerUID}/games`).transaction(updatePlayerGames),
                db.ref(`players/${opponentUID}/games`).transaction(updatePlayerGames)
            ])).then(() => {

                dispatch(gameStarted(newGame));

                Actions.game({title: players[playerUID].name + ' vs ' + players[opponentUID].name, type: ActionConst.REPLACE});
            });
        }).catch(err => {
            console.log('Could not start game becouse:', err);
        });
    };
};

export const updateGame = game => ({
    type: ACTION_TYPES.UPDATE_GAME,
    game
});

export const updatePlayers = (searchStr, players) => ({
    type: ACTION_TYPES.UPDATE_PLAYERS,
    searchStr,
    players
});

export const resizeGameSurface = (dispatch, width, height) => {
    dispatch({
        type: ACTION_TYPES.RESIZE_GAME_SURFACE,
        surfaceWidth: width,
        surfaceHeight: height
    });
};

export const endGame = (dispatch, gameKey, player) => {
    const gameRef = db.ref(`games/${gameKey}`);
    const playerRef = db.ref(`players/${player}`);
    
    // do not receive updates on this game anymore
    gameRef.off();

    gameRef.once('value').then(snapshot => {
        const game = snapshot.val();
        const opponent = Object.keys(game.players).find(uid => uid !== player);

        // remove game from player
        playerRef.transaction(player => {
            if (player && player.games) {
                player.games = player.games.filter(playerGame => playerGame !== gameKey);
            }
            return player;
        });

        return db.ref(`players/${opponent}/games`).once('value').then(val => {
            if (val.exists() && val.val().some(gameID => gameID === gameKey)) {
                if (game.currentPlayer === player) {
                    gameRef.child('currentPlayer').set(opponent);
                }
            } else {
                if (game.currentPlayer === player) {
                    gameRef.remove();
                }
            }
        });
    }).catch(e => console.log(e));

    dispatch({
        type: ACTION_TYPES.END_GAME,
        gameKey
    });
}