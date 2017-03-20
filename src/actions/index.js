import db from '../database';
import { createInitialBoard, createInitialTowerPositions, initialColors, getGameKey } from '../reducers/game';
import firebase from 'firebase';
import Game from '../models/Game';
import { PAGES } from '../models/Page';

export const ACTION_TYPES = {
    UPDATE_TOKEN: 'UPDATE_TOKEN',
    PUSH_PAGE: 'PUSH_PAGE',
    POP_PAGE: 'POP_PAGE',
    POP_UNTIL_PAGE: 'POP_UNTIL_PAGE',
    REPLACE_PAGE: 'REPLACE_PAGE',
    INIT_PAGE: 'INIT_PAGE',
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

export function updateToken(token) {
    return (dispatch, getState) => {
        const state = getState();

        dispatch(setToken(token));
        if (state.app.player) {
            db.ref(`players/${state.app.player.uid}/token`).set(token);
        }
    };
}

const setToken = token => ({
    type: ACTION_TYPES.UPDATE_TOKEN,
    token
});

/**
 * @param {Page} page 
 */
export function pushPage(page) {
    return {
        type: ACTION_TYPES.PUSH_PAGE,
        page
    };
}

/**
 * @param {Page} page 
 */
export function replacePage(page) {
    return {
        type: ACTION_TYPES.REPLACE_PAGE,
        page
    };
}

/**
 */
export function popPage() {
    return {
        type: ACTION_TYPES.POP_PAGE
    };
}

/**
 */
export function popPageUntil(page) {
    return {
        type: ACTION_TYPES.POP_UNTIL_PAGE,
        page
    };
}

/**
 * @param {Page} page 
 */
export function initializeWithPage(page) {
    return {
        type: ACTION_TYPES.INIT_PAGE,
        page
    };
}

export function logout() {
    return dispatch => {
        dispatch(startLoading('Logging out ...'));
        firebase.auth().signOut().then(() => {
            dispatch(setPlayer(null, null));
            dispatch(initializeWithPage(PAGES.LOGIN));
        }).catch(e => {
            console.error('Could not log out user, because: ', e);
        }).then(() => {
            dispatch(endLoading());
        });
    };
}

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
        db.ref(`games/${gameKey}`).on('value', snapshot => {
            const gameState = snapshot.val();

            if (gameState !== null) {
                dispatch(updateGame(gameState));
            }
        });
    };
}

export function suspendGame() {
    return (dispatch, getState) => {
        const currentState = getState();
        const currentGame = currentState.app.currentGame;

        console.log(`suspending game: ${currentGame}`);
        db.ref(`games/${currentGame}`).off();
        dispatch(resumeGame(null));
        dispatch(popPageUntil(PAGES.DASHBOARD));
    };
}

export function stopListeningForGameUpdates(gameKey) {
    return dispatch => () => {
        db.ref(`games/${gameKey}`).off();
    };
}

export function loadGameFromKey(gameKey) {
    return (dispatch, getState) => {
        const currentState = getState();

        dispatch(startLoading(`Resuming game ...`));
        db.ref(`games/${gameKey}`)
            .once('value')
            .then(gameSnapshot => {
                if (gameSnapshot.exists()) {
                    const game = gameSnapshot.val();
                    const player = Game.getPlayer(game, currentState.app.player.uid);
                    const opponent = Game.getOpponent(game, currentState.app.player.uid);
                    const gamePage = PAGES.GAME.withTitle(`${player.name} vs ${opponent.name}`).withBackButtonAction(() => {
                        dispatch(suspendGame());
                    });

                    dispatch(resumeGame(gameKey));
                    dispatch(updateGame(game));
                    dispatch(endLoading());
                    dispatch(pushPage(gamePage));
                    dispatch(startListeningForGameUpdates(gameKey));
                }
        })
    };
}

export function startListeningForGamelistUpdates(playerUid) {
    return dispatch => {
        const playerGamesRef = db.ref(`players/${playerUid}/games`);
        
        gamelistSubscriptionRef = playerGamesRef.on('value', snapshot => {
            const games = snapshot.val() || {};
            dispatch(updateGames(games));
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

export function clickOnField(field, playerUid, opponentUid, currentGame) {
    return (dispatch, getState) => {
        const oldState = getState();
        dispatch(clickedOnField(field, playerUid, currentGame));
        const newState = getState();

        if (oldState.game.currentPlayer !== newState.game.currentPlayer) {
            db.ref(`games/${currentGame}`)
            .update(newState.game)
            .then(() => [playerUid, opponentUid].map(uid => 
                db.ref(`players/${uid}/games/${currentGame}/currentPlayer`).set(newState.game.currentPlayer)
            ));
        }
    };
}

export const clickedOnField = (field, playerUid, currentGame) => ({
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
    return (dispatch, getState) => {
        firebase.auth().onAuthStateChanged(user => {
            console.log('auth change: ', user);
            if (user) {
                dispatch(startLoading('We are logging you back in ...'));
                db.ref(`players/${user.uid}`)
                    .once('value')
                    .then(snapshot => {
                    const dbUser = snapshot.val();
                    dbUser.uid = user.uid;
                    const state = getState();

                    console.log('setting user: ', dbUser);
                    dispatch(setPlayer(dbUser, user));
                    dispatch(endLoading());
                    dispatch(pushPage(PAGES.DASHBOARD.withTitle(`Playing as ${dbUser.name}`)))
                    console.log('you got logged in');

                    if (state.app.token) {
                        db.ref(`players/${user.uid}/token`).set(state.app.token).then(() => {
                            console.debug('set app token on player.');
                        });
                    }
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

        const playersCopy = {};
        for (uid in players) {
            Object.assign(playersCopy, {
                [uid]: {
                    name: players[uid].name
                }
            });
        }
        console.log('playerscopy: ', playersCopy);

        const newGame = {
            players: playersCopy,
            currentPlayer: playerUID,
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
                gamesObj = gamesObj || {};
                gamesObj[gameName] = {
                    players: {
                        [player.key]: {
                            name: player.val().name
                        },
                        [opponent.key]: {
                            name: opponent.val().name
                        }
                    },
                    currentPlayer: newGame.currentPlayer
                };
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
                dispatch(replacePage(PAGES.GAME.withTitle(`${players[playerUID].name} vs ${players[opponentUID].name}`)));
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
        const searchStart = searchStr.toLowerCase();
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

export const resizeGameSurface = (width, height) => ({
    type: ACTION_TYPES.RESIZE_GAME_SURFACE,
    surfaceWidth: width,
    surfaceHeight: height
});

export function endGame(gameKey, player) {
    return dispatch => {
        const gameRef = db.ref(`games/${gameKey}`);
        const playerGameRef = db.ref(`players/${player}/games/${gameKey}`);
        
        // do not receive updates on this game anymore
        gameRef.off();

        gameRef.once('value').then(snapshot => {
            const game = snapshot.val();
            const opponent = Object.keys(game.players).find(uid => uid !== player);

            // remove game from player
            playerGameRef.remove();

            // if opponent still has game
            return db.ref(`players/${opponent}/games/${gameKey}`).once('value').then(val => {
                if (val.exists()) {
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
            dispatch(popPage())
        );
    };
}

export const gameEnded = (gameKey, player) => ({
    type: ACTION_TYPES.GAME_ENDED,
    gameKey
});
