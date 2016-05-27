export const ACTION_TYPES = {
    CLICK_ON_FIELD: 'CLICK_ON_FIELD',
    SET_PLAYER_NAME: 'SET_PLAYER_NAME',
    NEW_GAME: 'NEW_GAME'
};

export const clickOnField = field => ({
    type: ACTION_TYPES.CLICK_ON_FIELD,
    field
});

export const setPlayerName = playerName => ({
    type: ACTION_TYPES.SET_PLAYER_NAME,
    playerName
});

export const newGame = game => ({
    type: ACTION_TYPES.NEW_GAME,
    game
})