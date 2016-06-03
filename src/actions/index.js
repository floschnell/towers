export const ACTION_TYPES = {
    CLICK_ON_TOWER: 'CLICK_ON_TOWER',
    CLICK_ON_FIELD: 'CLICK_ON_FIELD',
    SET_PLAYER_NAME: 'SET_PLAYER_NAME',
    UPDATE_GAMES: 'UPDATE_GAMES',
    RESUME_GAME: 'RESUME_GAME',
    START_GAME: 'START_GAME',
    UPDATE_GAME: 'UPDATE_GAME',
    UPDATE_PLAYERS: 'UPDATE_PLAYERS'
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