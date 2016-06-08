import db from '../database';

export const ACTION_TYPES = {
    CLICK_ON_TOWER: 'CLICK_ON_TOWER',
    CLICK_ON_FIELD: 'CLICK_ON_FIELD',
    SET_PLAYER_NAME: 'SET_PLAYER_NAME',
    UPDATE_GAMES: 'UPDATE_GAMES',
    RESUME_GAME: 'RESUME_GAME',
    START_GAME: 'START_GAME',
    UPDATE_GAME: 'UPDATE_GAME',
    UPDATE_PLAYERS: 'UPDATE_PLAYERS',
    END_GAME: 'END_GAME',
    RESIZE_GAME_SURFACE: 'RESIZE_GAME_SURFACE'
};

export const clickOnTower = (tower, playerName, currentGame) => ({
    type: ACTION_TYPES.CLICK_ON_TOWER,
    tower,
    playerName,
    currentGame
});

export const clickOnField = (field, playerName, currentGame) => ({
    type: ACTION_TYPES.CLICK_ON_FIELD,
    field,
    playerName,
    currentGame
});

export const setPlayerName = playerName => ({
    type: ACTION_TYPES.SET_PLAYER_NAME,
    playerName
});

export const updateGames = (dispatch, playerName) => {
    const playerGamesRef = db.ref(`players/${playerName}/games`);
    
    playerGamesRef.on('value', snapshot => {
        const games = snapshot.val() || [];
        const gamePromises = games.map(game => {
            return db.ref(`games/${game}`).once('value');
        });
        Promise.all(gamePromises).then(games => {
            const mapGameToDetails = {};
            games.forEach(game => {
                mapGameToDetails[game.key] = game.val();
            });
            console.log(mapGameToDetails);
            dispatch({
                type: ACTION_TYPES.UPDATE_GAMES,
                games: mapGameToDetails
            });
        });
    });
};

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
    const playerRef = db.ref(`players/${player}`);
    
    // do not receive updates on this game anymore
    gameRef.off();
    
    // remove player from game
    const gamePromise = gameRef.transaction(gameObj => {
        if (gameObj && gameObj.game) {
            if (gameObj.game.player0 === player) {
                delete gameObj.game.player0;
            }
            if (gameObj.game.player1 === player) {
                delete gameObj.game.player1;
            }
        }
        return gameObj;
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
                if (gameObj.game) {
                    if (typeof gameObj.game.player0 === 'undefined' && typeof gameObj.game.player1 === 'undefined') {
                        gameRef.remove().catch(err => { console.warn('could not delete game!'); });
                    }
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