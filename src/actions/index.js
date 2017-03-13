import db from '../database';
import { createInitialBoard, createInitialTowerPositions, initialColors, getGameKey } from '../reducers/game';
import firebase from 'firebase';
import Game from '../models/Game';
import { PAGES } from '../models/Page';

export const ACTION_TYPES = {
    GO_TO_PAGE: 'GO_TO_PAGE',
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
    GAME_ENDED: 'GAME_ENDED',
    RESIZE_GAME_SURFACE: 'RESIZE_GAME_SURFACE'
};

let gamelistSubscriptionRef = null;
let gameSubscriptionRef = null;

export const goToPage = (page, options = {}) => ({
    type: ACTION_TYPES.GO_TO_PAGE,
    page,
    options
});

export function login(email, password) {
    return dispatch => {
        dispatch(startLoading('Authenticating ...'));

        firebase.auth()
        .signInWithEmailAndPassword(email, password)
        .then(user => {
            dispatch(endLoading());
        }).catch(error => {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            alert(errorMessage);
            dispatch(endLoading());
        });
    };
}

export function startListeningForGameUpdates(gameKey) {
    return dispatch => {
        gameSubscriptionRef = db.ref(`games/${gameKey}`).on('value', snapshot => {
            const gameState = snapshot.val();

            if (gameState !== null) {
                console.log('got new state:', gameState);
                dispatch(updateGame(gameState));
            }
        });
    };
}

export function stopListeningForGameUpdates(gameKey) {
    if (gameSubscriptionRef) {
        db.ref(`games/${gameKey}`).off('value', gameSubscriptionRef);
    }
}

export function loadGame(game) {
    return dispatch => {
        const playerUID = firebase.auth().currentUser.uid;
        const gameKey = Game.getKey(game);
        const playerName = Game.getPlayer(game, playerUID).name;
        const opponentName = Game.getOpponent(game, playerUID).name;
        console.log(playerName, opponentName);

        dispatch(startLoading(`Loading game ${playerName} vs ${opponentName}`));
        dispatch(resumeGame(gameKey));
        console.log('choose game:', gameKey);
        db.ref(`games/${gameKey}`).once('value').then(snapshot => {
            const gameState = snapshot.val();
            console.log('got new state:', gameState);
            dispatch(updateGame(gameState));
            dispatch(endLoading());
            dispatch(goToPage(PAGES.GAME.withTitle(`${playerName} vs ${opponentName}`)));
        }).catch(e => {
            dispatch(endLoading());
        });
    }
}

export function startListeningForGamelistUpdates(playerUid) {
    return dispatch => {
        const playerGamesRef = db.ref(`players/${playerUid}/games`);
        
        gamelistSubscriptionRef = playerGamesRef.on('value', snapshot => {
            const games = snapshot.val() || [];
            const gamePromises = games.map(game => {
                return db.ref(`games/${game}`).once('value');
            });
            
            Promise.all(gamePromises).then(games => {
                const mapGameToDetails = {};

                games.forEach(game => {
                    if (game.exists()) {
                        mapGameToDetails[game.key] = game.val();
                    }
                });
                console.log('updateGames:', mapGameToDetails);

                dispatch(updateGames(mapGameToDetails));
            });
        });
    }
}

export function stopListeningForGamelistUpdates(playerUid) {
    return dispatch => {
        if (gamelistSubscriptionRef) {
            const playerGamesRef = db.ref(`players/${playerUid}/games`);

            playerGamesRef.off('value', gamelistSubscriptionRef);
        }
    };
}

export function createAccount(username, email, password) {
     return dispatch => {
        const playerObj = {
            name: username,
            searchName: username.toLowerCase()
        };

        dispatch(startLoading());
        firebase.auth().createUserWithEmailAndPassword(email, password).then(result => {
            const playerRef = db.ref(`players/${result.uid}`);
            
            return playerRef.set(playerObj);
        }).then(() => {
            const user = firebase.auth().currentUser;
            playerObj.uid = user.uid;

            dispatch(setPlayer(playerObj, user));
            dispatch(endLoading());
        }).catch(error => {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            alert(`Unknown error: ${errorCode} ${errorMessage}`);
            dispatch(endLoading());
        });
    };
}

export function startLoading(message) {
    return {
        type: ACTION_TYPES.START_LOADING,
        message
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

export function waitForLogin() {
    return dispatch => {
        firebase.auth().onAuthStateChanged(user => {
            console.log('auth change: ', user);
            if (user) {
                dispatch(startLoading('We are logging you back in ...'));
                db.ref(`players/${user.uid}`)
                    .once('value')
                    .then(snapshot => {
                    const dbUser = snapshot.val();
                    dbUser.uid = user.uid;
                    console.log('setting user: ', dbUser);
                    dispatch(setPlayer(dbUser, user));
                    dispatch(endLoading());
                    dispatch(goToPage(PAGES.DASHBOARD))
                    console.log('you got logged in');
                }).catch(err => {
                    firebase.auth().signOut();
                    console.log('login failed:', err);
                });
            } else {
                dispatch(setPlayer(null))
            }
        });
    }
}

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
                dispatch(goToPage(PAGES.GAME.withTitle(`${players[playerUID].name} vs ${players[opponentUID].name}`)));
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
        }).catch(e => {
            console.error('an error occured while ending the game:', e);
        }).then(() =>
            dispatch(goToPage(PAGES.DASHBOARD))
        );
    };
}

export const gameEnded = (gameKey, player) => ({
    type: ACTION_TYPES.GAME_ENDED,
    gameKey
});
