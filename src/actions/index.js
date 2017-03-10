import db from '../database';
import { createInitialBoard, createInitialTowerPositions, initialColors, getGameKey } from '../reducers/game';
import {Actions, ActionConst} from 'react-native-router-flux';
import firebase from 'firebase';

export const ACTION_TYPES = {
    START_LOADING: 'START_LOADING',
    END_LOADING: 'END_LOADING',
    CLICK_ON_TOWER: 'CLICK_ON_TOWER',
    CLICK_ON_FIELD: 'CLICK_ON_FIELD',
    SET_PLAYER: 'SET_PLAYER',
    UPDATE_GAMES: 'UPDATE_GAMES',
    RESUME_GAME: 'RESUME_GAME',
    START_GAME: 'START_GAME',
    UPDATE_GAME: 'UPDATE_GAME',
    START_SEARCH_FOR_PLAYERS: 'START_SEARCH_FOR_PLAYERS',
    UPDATE_PLAYERS: 'UPDATE_PLAYERS',
    END_GAME: 'END_GAME',
    RESIZE_GAME_SURFACE: 'RESIZE_GAME_SURFACE'
};

export function startLoading() {
    return {
        type: ACTION_TYPES.START_LOADING
    };
}

export function endLoading() {
    return {
        type: ACTION_TYPES.END_LOADING
    };
}

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
        dispatch(startLoading());

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
                dispatch(endLoading());

                Actions.game({title: players[playerUID].name + ' vs ' + players[opponentUID].name, type: ActionConst.REPLACE});
            });
        }).catch(err => {
            dispatch(endLoading());
            console.log('Could not start game becouse:', err);
        });
    };
};

export const updateGame = game => ({
    type: ACTION_TYPES.UPDATE_GAME,
    game
});

export function searchForPlayers(searchStr) {
    return dispatch => {
        const currentUser = firebase.auth().currentUser;
        const searchStart = searchStr;
        const searchEnd = `${searchStart}\uf8ff`;

        db.ref('players')
            .orderByChild('searchName')
            .startAt(searchStart)
            .endAt(searchEnd)
            .once('value')
            .then(snapshot => {
                if (snapshot.exists()) {
                    const playersObj = snapshot.val();
                    if (playersObj[currentUser.uid]) {
                        delete playersObj[currentUser.uid];
                    }
                    dispatch(updatePlayers(searchStr, playersObj));
                } else {
                    dispatch(updatePlayers(searchStr, []));
                }
            });
    }
}

export const startSearchForPlayers = searchStr => ({
    type: ACTION_TYPES.START_SEARCH_FOR_PLAYERS,
    searchStr
});

export const updatePlayers = (searchStr, players) => ({
    type: ACTION_TYPES.UPDATE_PLAYERS,
    players
});

export const resizeGameSurface = (dispatch, width, height) => {
    dispatch({
        type: ACTION_TYPES.RESIZE_GAME_SURFACE,
        surfaceWidth: width,
        surfaceHeight: height
    });
};

export function endGame(gameKey, player) {
    return dispatch => {
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
        }).then(() => {
            dispatch(gameEnded(gameKey));
        }).catch(e => console.log(e));
    };
}

export const gameEnded = (gameKey, player) => ({
    type: ACTION_TYPES.END_GAME,
    gameKey
});