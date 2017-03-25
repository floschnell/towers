import Game from './models/Game';
import { getColor } from './utils';
import GameLogic from './gamelogic';

export const TUTORIAL_MESSAGE_POSITION = {
    TOP: 'TOP',
    BOARD_EDGE: 'BOARD_EDGE'
};

export function nextTutorialState(gameState) {
    const initialTowers = Game.createInitialTowerPositions(Object.keys(gameState.players));
    const playerID = Object.keys(gameState.players).find(id => id !== 'computer');
    const computerID = 'computer';
    const getPlayerField = (x, y) => (playerID < computerID) ? { x: 7 - x, y: 7 - y} : {x, y};
    const getComputerField = (x, y) => (computerID < playerID) ? { x: 7 - x, y: 7 - y} : {x, y};

    switch (gameState.tutorial.step) {
        case 0:
            gameState.tutorial.messagePosition = TUTORIAL_MESSAGE_POSITION.BOARD_EDGE;
            gameState.tutorial.message = `Every game starts off like this.
                                    The player who started the game makes the first move.
                                    The black rectangles (towers) are yours. The color inside the rectangles determine the color of the tower.
                                    Initially the towers are standing on fields with same color.
                                    Because it is the first move, you will be free to choose which of your towers you want to move.

                                    Click on one of your towers to continue`.replace(/\s+/g, ' ');
            gameState.tutorial.continueOnTowerClick = true;
            gameState.tutorial.continueOnFieldClick = false;
            gameState.tutorial.continueOnMessageClick = false;
            break;
        case 1:
        gameState.tutorial.messagePosition = TUTORIAL_MESSAGE_POSITION.BOARD_EDGE;
            gameState.tutorial.message = `Towers can only move straight and diagonally and only upwards the board.
                                        Also they cannot move past obstacles like the board edges or other towers.
                                        Choose a valid target field for your tower to continue.`.replace(/\s+/g, ' ');
            gameState.tutorial.continueOnTowerClick = false;
            gameState.tutorial.continueOnFieldClick = true;
            gameState.tutorial.continueOnMessageClick = false;
            break;
        case 2:
            gameState.tutorial.messagePosition = TUTORIAL_MESSAGE_POSITION.BOARD_EDGE;
            const fieldColor = getColor(gameState.moves[gameState.moves.length - 1].targetField.color);

            gameState.tutorial.message = `You made your first move. The color of the field that you placed your tower on,
                                        determines what tower your opponent will have to move next. Because you moved
                                        your tower on a ${fieldColor} field, your opponents ${fieldColor} tower is now marked active.`.replace(/\s+/g, ' ');
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
                    color: 7
                },{
                    sourceField: getComputerField(6, 7),
                    targetField: getComputerField(6, 2),
                    player: computerID,
                    color: 1
                },{
                    sourceField: getPlayerField(5, 7),
                    targetField: getPlayerField(3, 5),
                    player: playerID,
                    color: 2
                },{
                    sourceField: getComputerField(3, 7),
                    targetField: getComputerField(7, 3),
                    player: computerID,
                    color: 4
                }
            ];
            gameState.currentPlayer = playerID;
            gameState.currentColor = 4;
            gameState.towerPositions = GameLogic.executeMoves(initialTowers, gameState.moves);
            gameState.tutorial.messagePosition = TUTORIAL_MESSAGE_POSITION.TOP;
            gameState.tutorial.message = `In some cases the tower of the active player is blocked and can not move.
                                          The player is then forced to make a zero-length move.
                                          This means that the move will end on the same field as the tower is currently standing on.
                                          You can use the circumstance that the yellow tower of your opponent can not be moved to actually win the game. Try it!`.replace(/\s+/g, ' ');
            gameState.tutorial.continueOnTowerClick = false;
            gameState.tutorial.continueOnFieldClick = true;
            gameState.tutorial.continueOnMessageClick = false;
            break;
        case 4:
            const shouldField = getPlayerField(7, 3);
            const isField = gameState.moves[gameState.moves.length - 1].targetField;
            console.log('should', shouldField, 'but is', isField);
            if (isField.x === shouldField.x && isField.y === shouldField.y) {
                gameState.tutorial.message = `Awesome! You are one move away from winning the game.
                                              Go ahead and win the game.
                                              After that, you can go and find some real players!`.replace(/\s+/g, ' ');
            } else {
                gameState.tutorial.step--;
                nextTutorialState(gameState);
                gameState.tutorial.step--;
                gameState.tutorial.message = `Try again. You should aim for a yellow field, so that your opponent will not be able to move.`.replace(/\s+/g, ' ');
            }
            gameState.tutorial.continueOnTowerClick = false;
            gameState.tutorial.continueOnFieldClick = true;
            gameState.tutorial.continueOnMessageClick = false;
            break;
    }
    gameState.tutorial.step++;
    console.debug('tutorial step:', gameState.tutorial.step);
}