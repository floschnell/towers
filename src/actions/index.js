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
    USERNAME_CHECKED: 'USERNAME_CHECKED',
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

export function checkUsername(playerName) {
    return dispatch => {
        const playerID = playerName.toLowerCase();

        db.child(`players/${playerID}`)
        .once('value')
        .then(playerSnapshot => {
                dispatch(usernameChecked(!playerSnapshot.exists()));
        });
    };  
}

export function updateToken(token) {
    return (dispatch, getState) => {
        const state = getState();

        dispatch(setToken(token));
    };
}

const setToken = token => ({
    type: ACTION_TYPES.UPDATE_TOKEN,
    token
});

export function usernameChecked(result) {
    return {
        type: ACTION_TYPES.USERNAME_CHECKED,
        result
    };
}

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

export function login(id, password) {
    return dispatch => {
        dispatch(startLoading('Authenticating ...'));

        db.child(`players/${id.toLowerCase()}`).once('value').then(playerSnapshot => {
            if (!playerSnapshot.exists()) {
                throw 'This player does not exist!';
            }

            firebase.auth()
            .signInWithEmailAndPassword(playerSnapshot.val().mail, password)
            .then(user => {
                dispatch(endLoading());
            }).catch(error => {
                throw error.message;
            });
        }).catch(error => {
            alert(error);
            dispatch(endLoading());
        });
    };
}

export function startListeningForGameUpdates(gameKey) {
    return dispatch => {
        db.child(`games/${gameKey}`)
          .on('value', snapshot => {
            const gameState = snapshot.val();

            if (gameState !== null) {
                dispatch(updateGame(gameState));
            }
        });
    };
}

export function suspendGame(gameKey) {
    return (dispatch) => {
        console.log(`suspending game: ${gameKey}`);
        db.child(`games/${gameKey}`).off();
        dispatch(resumeGame(null));
    };
}

export function stopListeningForGameUpdates(gameKey) {
    return dispatch => () => {
        db.child(`games/${gameKey}`).off();
    };
}

export function loadGameFromKey(gameKey) {
    return (dispatch, getState) => {
        const currentState = getState();

        dispatch(startLoading(`Resuming game ...`));
        db.child(`games/${gameKey}`)
            .once('value')
            .then(gameSnapshot => {
                if (gameSnapshot.exists()) {
                    const game = gameSnapshot.val();
                    const player = Game.getPlayer(game, currentState.app.player.id);
                    const opponent = Game.getOpponent(game, currentState.app.player.id);
                    const gamePage = PAGES.GAME.withTitle(`${player.name} vs ${opponent.name}`).whenRemoved(() => {
                        dispatch(suspendGame(gamekey));
                    });

                    dispatch(resumeGame(gameKey));
                    dispatch(updateGame(game));
                    dispatch(endLoading());
                    dispatch(pushPage(gamePage));
                }
        })
    };
}

export function startListeningForGamelistUpdates(playerID) {
    return dispatch => {
        const playerGamesRef = db.child(`players/${playerID}/games`);
        
        playerGamesRef.on('value', snapshot => {
            const games = snapshot.val() || {};
            dispatch(updateGames(games));
        });
    }
}

export function stopListeningForGamelistUpdates(playerID) {
    return dispatch => {
        const playerGamesRef = db.child(`players/${playerID}/games`);

        playerGamesRef.off('value');
    };
}

export function createAccount(username, email, password) {
     return dispatch => {
        const playerID = username.toLowerCase()
        const playerObj = {
            name: username,
            mail: email
        };

        dispatch(startLoading());

        db.child(`players/${playerID}`)
            .once('value')
            .then(snapshot => {
                return !snapshot.exists();
            }).then(valid => {
                if (valid) {
                    return firebase.auth().createUserWithEmailAndPassword(email, password)
                    .then(user => {
                        const playerRef = db.child(`players/${playerID}`);
                        playerObj.uid = user.uid;
                        
                        return playerRef.set(playerObj);
                    }).then(playerSnapshot => {
                        dispatch(setPlayer(playerObj));
                    })
                } else {
                    alert('Username is already taken.');
                    return Promise.resolve();
                }
            }).catch(error => {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                alert(`Unknown error: ${errorCode} ${errorMessage}`);
            }).then(() => {
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

export const clickOnTower = (tower, playerID, currentGame) => ({
    type: ACTION_TYPES.CLICK_ON_TOWER,
    tower,
    playerID,
    currentGame
});

export function clickOnField(field, playerID, opponentID, currentGame) {
    return (dispatch, getState) => {
        const oldState = getState();
        dispatch(clickedOnField(field, playerID, currentGame));
        const newState = getState();

        if (oldState.game.currentPlayer !== newState.game.currentPlayer) {
            const game = {
                currentColor: newState.game.currentColor,
                currentPlayer: newState.game.currentPlayer,
                players: newState.game.players,
                moves: newState.game.moves
            };

            db.child(`games/${currentGame}`)
            .update(game)
            .then(() => [playerID, opponentID].map(id => 
                db.child(`players/${id}/games/${currentGame}/currentPlayer`).set(game.currentPlayer)
            ));
        }
    };
}

export const clickedOnField = (field, playerID, currentGame) => ({
    type: ACTION_TYPES.CLICK_ON_FIELD,
    field,
    playerID,
    currentGame
});

export const setPlayer = player => ({
    type: ACTION_TYPES.SET_PLAYER,
    player
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
        const state = getState();

        firebase.auth().onAuthStateChanged(user => {
            console.debug('auth change: ', user);
            if (user) {
                dispatch(startLoading('We are logging you back in ...'));
                db.child('players').orderByChild('uid').equalTo(user.uid).once('value').then(playerSnapshot => {
                    if (!playerSnapshot.exists()) {
                        throw 'Player does not exist!';
                    }

                    const matchingPlayers = Object.keys(playerSnapshot.val());
                    if (matchingPlayers.length > 1) {
                        throw 'There exists more than one player with that UID!';
                    }
                    const playerID = matchingPlayers[0];
                    const player = Object.assign(playerSnapshot.val()[playerID], {
                        id: playerID
                    });
                    console.debug('setting user: ', player);
                    dispatch(setPlayer(player));
                    dispatch(endLoading());
                    dispatch(pushPage(PAGES.DASHBOARD.withTitle(`Playing as ${player.name}`)))
                    console.debug('you got logged in');

                    if (state.app.token) {
                        db.child(`players/${playerID}/token`).set(state.app.token).then(() => {
                            console.debug('set app token on player.');
                        });
                    }
                }).catch(e => {
                    dispatch(endLoading());
                    firebase.auth().signOut();
                    alert('Could not log you in because: ' + e);
                });
            } else {
                dispatch(setPlayer(null))
            }
        });
    }
}

export function startGame(playerID, opponentID, players) {
    return dispatch => {

        dispatch(startLoading(`starting game against ${players[opponentID].name}`));

        const playersCopy = {};
        for (id in players) {
            Object.assign(playersCopy, {
                [id]: {
                    name: players[id].name
                }
            });
        }
        console.debug('playerscopy: ', playersCopy);

        const newGame = {
            players: playersCopy,
            currentPlayer: playerID,
            moves: []
        };
        const gameName = getGameKey(newGame);
        const playerRef = db.child(`players/${playerID}`);
        const opponentRef = db.child(`players/${opponentID}`);
        const gameRef = db.child(`games/${gameName}`);

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
                db.child(`players/${playerID}/games`).transaction(updatePlayerGames),
                db.child(`players/${opponentID}/games`).transaction(updatePlayerGames)
            ])).then(() => {
                dispatch(gameStarted(newGame));
                dispatch(endLoading());
                dispatch(replacePage(PAGES.GAME.withTitle(`${players[playerID].name} vs ${players[opponentID].name}`)));
            });
        }).catch(err => {
            dispatch(endLoading());
            console.log('Could not start game because:', err);
        });
    };
};

export const updateGame = game => ({
    type: ACTION_TYPES.UPDATE_GAME,
    game
});

export function searchForPlayers(searchStr) {
    return dispatch => {
        const searchStart = searchStr.toLowerCase();
        const searchEnd = `${searchStart}\uf8ff`;

        db.child('players')
        .orderByKey()
        .startAt(searchStart)
        .endAt(searchEnd)
        .once('value')
        .then(snapshot => {
            if (snapshot.exists()) {
                dispatch(updatePlayers(searchStr, snapshot.val()));
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
        const gameRef = db.child(`games/${gameKey}`);
        const playerGameRef = db.child(`players/${player}/games/${gameKey}`);
        
        // do not receive updates on this game anymore
        gameRef.off();

        gameRef.once('value').then(snapshot => {
            const game = snapshot.val();
            const opponent = Object.keys(game.players).find(uid => uid !== player);

            // remove game from player
            playerGameRef.remove();

            // if opponent still has game
            return db.child(`players/${opponent}/games/${gameKey}`).once('value').then(val => {
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
