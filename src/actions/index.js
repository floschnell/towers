import db from '../database';

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

export const startGame = (game, players) => ({
    type: ACTION_TYPES.START_GAME,
    game,
    players
});

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

export const endGame = (dispatch, game, player) => {
    const gameRef = db.ref(`games/${game}`);
    const gamePlayersRef = db.ref(`games/${game}/players`);
    const playerRef = db.ref(`players/${player}`);
    
    // do not receive updates on this game anymore
    gameRef.off();
    
    // remove player from game
    const gamePromise = gamePlayersRef.transaction(players => {
        if (players) {
            delete players[player];
        }
        return players;
    });
    
    // remove game from player
    const playerPromise = playerRef.transaction(player => {
        if (player && player.games) {
            player.games = player.games.filter(playerGame => playerGame !== game);
        }
        return player;
    });
    
    const removeUnusedGame = () => {
        
        // remove game if all players are gone
        gameRef.once('value').then(game => {
            if (game.exists()) {
                const gameObj = game.val();
                if (typeof gameObj.players === 'undefined' || gameObj.players === null) {
                    gameRef.remove().catch(err => { console.warn('could not delete game!'); });
                }
            }
        });
    };
    
    Promise.all([gamePromise, playerPromise]).then(result => {
        removeUnusedGame();
    }).catch(err => {
        removeUnusedGame();
    });
    
    dispatch({
        type: ACTION_TYPES.END_GAME,
        game
    });
}