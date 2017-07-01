import gameReducer from '../../src/reducers/game';
import {ACTION_TYPES} from '../../src/actions/index';
import Game from '../../src/models/Game';
import {MOVE_RESULTS} from '../../src/actions/game';
import Logger, {LOG_LEVELS} from '../../src/logger';

const cleanGameState = {
  players: {
    flo: {id: 'flo'},
    dumbo: {id: 'dumbo'},
  },
  currentPlayer: 'flo',
  currentColor: null,
  selectedTower: null,
  moves: [],
  board: null,
  isAIGame: false,
};

beforeAll(() => {
  Logger.setVerbosity(LOG_LEVELS.WARN);
});

describe('game reducer', () => {
  it('should allow any tower to be chosen, if no color has yet been set.', () => {
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

  it('should only allow the choice of the tower with matching color', () => {
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
    const resultState = gameReducer(gameStateWithCurrentColor, clickOnTowerAction);

    // THEN
    expect(resultState.selectedTower).toBeNull();
  });

  it('should execute valid moves', () => {
    // GIVEN
    const gameStateWithCurrentColor = Object.assign(cleanGameState, {
      currentColor: 0,
    });
    const clickOnFieldAction = {
      type: ACTION_TYPES.CLICK_ON_FIELD,
      field: {
        x: 7,
        y: 4,
        color: 0,
      },
      playerID: 'flo',
      gameID: 'dumbo-flo',
    };

    // WHEN
    const initializedGameState = Game.initialize(gameStateWithCurrentColor);
    const resultState = gameReducer(initializedGameState, clickOnFieldAction);

    // THEN
    const movedTower = Game.getTowerForPlayerAndColor(resultState, 'flo', 0);
    expect(resultState.moveResult).toEqual(MOVE_RESULTS.OK);
    expect(movedTower.x).toEqual(7);
    expect(movedTower.y).toEqual(4);
  });

  it('should not execute invalid moves', () => {
    // GIVEN
    const gameStateWithCurrentColor = Object.assign(cleanGameState, {
      currentColor: 0,
    });
    const clickOnFieldAction = {
      type: ACTION_TYPES.CLICK_ON_FIELD,
      field: {
        x: 2,
        y: 4,
        color: 0,
      },
      playerID: 'flo',
      gameID: 'dumbo-flo',
    };

    // WHEN
    const initializedGameState = Game.initialize(gameStateWithCurrentColor);
    const resultState = gameReducer(initializedGameState, clickOnFieldAction);

    // THEN
    expect(resultState.moveResult).toEqual(MOVE_RESULTS.INVALID);
  });

  it('should fail, when an invalid game state gets loaded.', () => {
    // GIVEN
    const updateGameAction = {
      type: ACTION_TYPES.UPDATE_GAME,
      game: {
        currentPlayer: 'dumbo',
        currentColor: 3,
        players: {
          flo: {
            id: 'flo',
          },
          dumbo: {
            id: 'dumbo',
          },
        },
        moves: [
          {
            color: 0,
            player: 'flo',
            sourceField: {
              x: 7,
              y: 7,
              color: 0,
            },
            targetField: {
              x: 7,
              y: 4,
              color: 3,
            },
          },
        ],
      },
    };

    // WHEN
    const resultState = gameReducer(cleanGameState, updateGameAction);

    // THEN
    expect(resultState.valid).toBeTruthy();
  });
});
