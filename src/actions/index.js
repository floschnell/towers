export const ACTION_TYPES = {
    CLICK_ON_FIELD: 'CLICK_ON_FIELD'
};

export const clickOnField = field => ({
    type: ACTION_TYPES.CLICK_ON_FIELD,
    field
});
