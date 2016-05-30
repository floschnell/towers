export const ACTION_TYPES = {
    CLICK_ON_FIELD: 'CLICK_ON_FIELD',
    SET_PLAYER_NAME: 'SET_PLAYER_NAME',
    UPDATE_GAMES: 'UPDATE_GAMES',
    START_GAME: 'START_GAME',
    UPDATE_GAME: 'UPDATE_GAME'
};

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

export const updateGames = (game, details) => ({
    type: ACTION_TYPES.UPDATE_GAMES,
    game,
    details
});

export const startGame = game => ({
    type: ACTION_TYPES.START_GAME,
    game
});

export const updateGame = game => ({
    type: ACTION_TYPES.UPDATE_GAME,
    game
});