import Game from './models/Game';
import {getColor} from './utils';
import {MOVE_RESULTS} from './actions/index';
import Logger from './logger';

export const TUTORIAL_MESSAGE_POSITION = {
  TOP: 'TOP',
  BOARD_EDGE: 'BOARD_EDGE',
};

/**
 * Iterates through the different tutorial steps.
 * Modifies the game state accordingly.
 *
 * @param {object} gameState Current game state.
 * @return {void}
 */
export function nextTutorialState(gameState) {
  gameState = Game.initialize(gameState);

  const playerID = Object.keys(gameState.players).find((id) => id !== 'computer');
  const computerID = 'computer';
  const getPlayerField = (x, y) =>
    (playerID < computerID ? {x: 7 - x, y: 7 - y} : {x, y});
  const getComputerField = (x, y) =>
    (computerID < playerID ? {x: 7 - x, y: 7 - y} : {x, y});

  switch (gameState.tutorial.step) {
    case 0:
      gameState.tutorial.messagePosition = TUTORIAL_MESSAGE_POSITION.BOARD_EDGE;
      gameState.tutorial.message = `
        Every game starts off like this. The player who started
        the game makes the first move. The black rectangles (towers) are yours.
        The color inside the rectangles determine the color of the tower.
        Initially your towers are standing on fields with same color on your board side.
        Because it is the first move, you will be free to choose which of
        your towers you want to move.
        
        Click on one of your towers to continue.`.replace(/\s+/g, ' ');
      gameState.tutorial.continueOnTowerClick = true;
      gameState.tutorial.continueOnFieldClick = false;
      gameState.tutorial.continueOnMessageClick = false;
      break;
    case 1:
      gameState.tutorial.messagePosition = TUTORIAL_MESSAGE_POSITION.BOARD_EDGE;
      gameState.tutorial.message = `
        Towers can only move straight and diagonally and only upwards the board.
        Also they cannot move past obstacles (like the board edges or other towers).
        The game ends as soon as one player is able to move one of his own towers
        at the other player's board side. Choose a valid target field
        for your tower to continue.`.replace(/\s+/g, ' ');
      gameState.tutorial.continueOnTowerClick = false;
      gameState.tutorial.continueOnFieldClick = true;
      gameState.tutorial.continueOnMessageClick = false;
      break;
    case 2:
      gameState.tutorial.messagePosition = TUTORIAL_MESSAGE_POSITION.BOARD_EDGE;
      const fieldColor = getColor(
        gameState.moves[gameState.moves.length - 1].targetField.color
      );
      gameState.currentPlayer = computerID;
      gameState.tutorial.message = `
        You made your first move.
        The line gives a visual hint which tower has recently been moved.
        The color of the field that you placed your tower on,
        determines what tower your opponent will have to move next.
        Because you moved your tower on a ${fieldColor} field,
        your opponents ${fieldColor} tower is now marked active.
        Click on the button below to continue.`.replace(/\s+/g, ' ');
      gameState.tutorial.continueOnTowerClick = false;
      gameState.tutorial.continueOnFieldClick = false;
      gameState.tutorial.continueOnMessageClick = true;
      break;
    case 3:
      gameState.moves = [
        {
          sourceField: getPlayerField(0, 7),
          targetField: getPlayerField(0, 5),
          player: playerID,
          color: 7,
        },
        {
          sourceField: getComputerField(6, 7),
          targetField: getComputerField(6, 2),
          player: computerID,
          color: 1,
        },
        {
          sourceField: getPlayerField(5, 7),
          targetField: getPlayerField(3, 5),
          player: playerID,
          color: 2,
        },
        {
          sourceField: getComputerField(3, 7),
          targetField: getComputerField(7, 3),
          player: computerID,
          color: 4,
        },
      ];
      gameState.currentPlayer = playerID;
      gameState.currentColor = 4;
      Game.initialize(gameState);
      gameState.tutorial.messagePosition = TUTORIAL_MESSAGE_POSITION.TOP;
      gameState.tutorial.message = `
        In some cases the tower of the active player is blocked and can not move.
        The player is then forced to make a zero-length move.
        This means that the move will end on the same field as
        the tower is currently standing on. In this case, you can
        use the circumstance that the yellow tower of your opponent
        can not be moved to even win the game. Try it!`.replace(/\s+/g, ' ');
      gameState.tutorial.continueOnTowerClick = false;
      gameState.tutorial.continueOnFieldClick = true;
      gameState.tutorial.continueOnMessageClick = false;
      break;
    case 4:
      const shouldFieldFirst = getPlayerField(7, 3);
      const isFieldFirst =
        gameState.moves[gameState.moves.length - 1].targetField;
      Logger.debug('should', shouldFieldFirst, 'but is', isFieldFirst);
      if (
        isFieldFirst.x === shouldFieldFirst.x &&
        isFieldFirst.y === shouldFieldFirst.y
      ) {
        gameState.tutorial.message = `
          Awesome! Your opponent could not move, because his yellow tower is blocked.
          So it's your turn again and you are only one move away from winning the game.
          Remember: the game is won as soon, as you reach the other side of the board.
          After that I suggest, you go and find some real players!`.replace(
          /\s+/g,
          ' '
        );
      } else {
        gameState.tutorial.step--;
        nextTutorialState(gameState);
        gameState.tutorial.step--;
        gameState.tutorial.message = `
          Try again. Aim for a yellow field,
          so that your opponent will not be able to move.`.replace(/\s+/g, ' ');
      }
      gameState.tutorial.continueOnTowerClick = false;
      gameState.tutorial.continueOnFieldClick = true;
      gameState.tutorial.continueOnMessageClick = false;
      break;
    case 5:
      const shouldFieldSecond = getPlayerField(4, 0);
      const isFieldSecond =
        gameState.moves[gameState.moves.length - 1].targetField;
      Logger.debug('should', shouldFieldSecond, 'but is', isFieldSecond);
      if (
        isFieldSecond.x !== shouldFieldSecond.x ||
        isFieldSecond.y !== shouldFieldSecond.y
      ) {
        gameState.tutorial.step--;
        gameState.moves.pop();
        Game.initialize(gameState);
        gameState.currentPlayer = playerID;
        gameState.currentColor = 4;
        gameState.tutorial.message = `
          This was not what I was expecting.
          You are one move away from defeating your opponent.
          Finish the game by reaching the other board side with
          one of your towers.`.replace(/\s+/g, ' ');
      }
      gameState.tutorial.continueOnTowerClick = false;
      gameState.tutorial.continueOnFieldClick = true;
      gameState.tutorial.continueOnMessageClick = false;
      break;
  }

  gameState.moveResult = MOVE_RESULTS.OK;
  gameState.tutorial.step++;
  Logger.debug('tutorial step:', gameState.tutorial.step);
}
