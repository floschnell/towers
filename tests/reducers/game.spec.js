import gameReducer from '../../src/reducers/game';
import {ACTION_TYPES} from '../../src/actions/index';

const cleanGameState = {
  players: {
    flo: {id: 'flo'},
    dumbo: {id: 'dumbo'},
  },
  currentPlayer: 'flo',
  currentColor: null,
  selectedTower: null,
  moves: [],
  isAIGame: false,
};

describe('game reducer', () => {
  test('select tower does not have to match color, if currentColor is not set', () => {
    // GIVEN
    const clickOnTowerAction = {
      type: ACTION_TYPES.CLICK_ON_TOWER,
      tower: {
        x: 0,
        y: 0,
        belongsTo: 'flo',
        color: 0,
      },
      playerID: 'flo',
    };

    // WHEN
    const resultState = gameReducer(cleanGameState, clickOnTowerAction);

    // THEN
    expect(resultState.selectedTower).toBeTruthy();
  });

  test('selected tower should match currentColor', () => {
    // GIVEN
    const gameStateWithCurrentColor = Object.assign(cleanGameState, {
      currentColor: 1,
    });
    const clickOnTowerAction = {
      type: ACTION_TYPES.CLICK_ON_TOWER,
      tower: {
        x: 0,
        y: 0,
        belongsTo: 'flo',
        color: 0,
      },
      playerID: 'flo',
    };

    // WHEN
    const resultState = gameReducer(
      gameStateWithCurrentColor,
      clickOnTowerAction
    );

    // THEN
    expect(resultState.selectedTower).toBeNull();
  });
});
