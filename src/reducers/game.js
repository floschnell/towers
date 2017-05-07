import {ACTION_TYPES, MOVE_RESULTS} from '../actions/index';
import Game from '../models/Game';
import Board from '../models/Board';
import {nextTutorialState, TUTORIAL_MESSAGE_POSITION} from '../tutorial';
import Logger from '../logger';

export default (state, action) => {
  if (typeof state === 'undefined') {
    const initialPlayers = {'0': {}, '1': {}};

    return {
      board: [],
      players: initialPlayers,
      currentPlayer: null,
      currentColor: null,
      selectedTower: null,
      moves: [],
      valid: true,
      moveResult: MOVE_RESULTS.OK,
      isTutorial: false,
      isAIGame: false,
      tutorial: {
        step: 0,
        message: '',
        messagePosition: TUTORIAL_MESSAGE_POSITION.BOARD_EDGE,
        continueOnFieldClick: false,
        continueOnMessageClick: false,
        continueOnTowerClick: false,
      },
      ai: {
        blockedPenalty: 20,
        couldFinishBonus: 10,
        aggressiveness: 0.5,
      },
    };
  }

  const newState = JSON.parse(
    JSON.stringify(state, (k, v) => {
      if (v instanceof Uint32Array) {
        return Array.from(v);
      }
      return v;
    })
  );
  const currentPlayer = state.currentPlayer;
  const currentColor = state.currentColor;

  switch (action.type) {
    case ACTION_TYPES.LAUNCH_GAME_AGAINST_AI:
      const aiGamePlayers = {
        computer: {
          name: 'Computer',
        },
        [action.player.id]: action.player,
      };

      Object.assign(newState, {
        selectedTower: undefined,
        currentColor: undefined,
        moves: [],
        board: [],
        players: aiGamePlayers,
        currentPlayer: action.player.id,
        valid: true,
        isAIGame: true,
        isTutorial: false,
        ai: {
          blockedPenalty: action.blockedPenalty,
          couldFinishBonus: action.couldFinishBonus,
          aggressiveness: action.aggressiveness,
        },
      });

      return Game.initialize(newState);

    case ACTION_TYPES.NEXT_TUTORIAL_STEP:
      Logger.debug('tutorial click on message');
      nextTutorialState(newState);
      return newState;

    case ACTION_TYPES.LAUNCH_TUTORIAL:
      const players = {
        computer: {
          name: 'Computer',
        },
        [action.player.id]: action.player,
      };

      Object.assign(newState, {
        selectedTower: undefined,
        currentColor: undefined,
        moves: [],
        board: [],
        players,
        currentPlayer: action.player.id,
        valid: true,
        isTutorial: true,
        tutorial: {
          step: 0,
        },
      });
      nextTutorialState(newState);
      return newState;

    case ACTION_TYPES.CLICK_ON_TOWER:
      if (currentPlayer === action.playerID) {
        if (state.isTutorial && state.tutorial.continueOnTowerClick) {
          Logger.debug('tutorial click on tower');
          nextTutorialState(newState);
        }

        const towerOnField = action.tower;
        if (
          typeof state.currentColor === 'undefined' ||
          state.currentColor === null ||
          towerOnField.color === state.currentColor
        ) {
          newState.selectedTower = action.tower;
        }
      }
      break;

    case ACTION_TYPES.CLICK_ON_FIELD:
      if (currentPlayer === action.playerID) {
        let towerToMove = null;
        const targetField = action.field;

        if (typeof currentColor === 'undefined') {
          towerToMove = state.selectedTower;
        } else {
          towerToMove = Game.getTowerForPlayerAndColor(
            state,
            currentPlayer,
            currentColor
          );
        }

        if (towerToMove && towerToMove.belongsToPlayer === currentPlayer) {
          const move = {
            player: currentPlayer,
            color: towerToMove.color,
            sourceField: towerToMove,
            targetField,
          };

          try {
            Game.executeMove(newState, move);

            const nextPlayer = Game.getOpponentID(newState, currentPlayer);
            const nextColor = targetField.color;

            if (Game.canMove(newState, nextPlayer, nextColor)) {
              newState.currentPlayer = nextPlayer;
              newState.currentColor = nextColor;
            } else {
              const blockedTower = Game.getTowerForPlayerAndColor(
                newState,
                nextPlayer,
                nextColor
              );
              const fieldColorOfBlockedTower = Board.getBoardColorAtCoord(
                blockedTower.x,
                blockedTower.y
              );

              newState.currentColor = fieldColorOfBlockedTower;
            }
            newState.selectedTower = null;
            if (!newState.moves) newState.moves = [];
            newState.moves.push(move);

            if (state.isTutorial && state.tutorial.continueOnFieldClick) {
              Logger.debug('tutorial click on field');
              nextTutorialState(newState);
            }
          } catch (e) {
            Logger.debug('move is invalid: ', e);
            newState.moveResult = MOVE_RESULTS.INVALID;
            newState.currentPlayer = currentPlayer;
            if (currentColor) {
              newState.currentColor = currentColor;
            }
            newState.selectedTower = towerToMove;
          }
        } else {
          newState.moveResult = MOVE_RESULTS.NO_TOWER_SELECTED;
        }
      } else {
        newState.moveResult = MOVE_RESULTS.NOT_YOUR_TURN;
      }
      return newState;

    case ACTION_TYPES.UPDATE_GAME:
      Logger.info('game state: ');
      try {
        const game = Game.initialize(action.game);
        const updatedState = Object.assign(newState, game, {valid: true});

        return updatedState;
      } catch (e) {
        Logger.warn('error during game update:', e);
        newState.valid = false;
        return newState;
      }

    case ACTION_TYPES.RESUME_GAME:
      delete newState.currentColor;

      return Object.assign(newState, {
        isTutorial: false,
        isAIGame: false,
        selectedTower: undefined,
        moves: [],
        board: [],
        tutorial: {
          message: '',
        },
      });

    case ACTION_TYPES.START_GAME:
      Logger.log('created game:', action.game);
      const newGameState = Object.assign({}, action.game);

      return Object.assign(newGameState, {
        isTutorial: false,
        tutorial: {
          message: '',
        },
        currentColor: undefined,
        selectedTower: undefined,
        board: [],
      });

    default:
  }

  return newState;
};
