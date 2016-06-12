import { checkMove, canMove } from '../src/gamelogic';
import { assert } from 'chai';
import initialTowers from './resources/towers.json';

const copyTowers = () => {
    return JSON.parse(JSON.stringify(initialTowers));
};

describe('Game Logic', function () {
    describe('checkMove', function () {
        it('should return true on a straight move of first player', function () {
            // GIVEN
            const towers = copyTowers();

            // WHEN
            const moveIsValid = checkMove(towers, 0, 0, { x: 0, y: 5 });

            // EXPECTED
            assert.isTrue(moveIsValid);
        });

        it('should return true on a right diagonal move of first player', function () {
            // GIVEN
            const towers = copyTowers();

            // WHEN
            const moveIsValid = checkMove(towers, 0, 0, { x: 5, y: 5 });

            // EXPECTED
            assert.isTrue(moveIsValid);
        });

        it('should return true on a left diagonal move of first player', function () {
            // GIVEN
            const towers = copyTowers();

            // WHEN
            const moveIsValid = checkMove(towers, 0, 7, { x: 2, y: 5 });

            // EXPECTED
            assert.isTrue(moveIsValid);
        });

        it('should return true on a straight move of second player', function () {
            // GIVEN
            const towers = copyTowers();

            // WHEN
            const moveIsValid = checkMove(towers, 1, 0, { x: 7, y: 2 });

            // EXPECTED
            assert.isTrue(moveIsValid);
        });

        it('should return true on a right diagonal move of second player', function () {
            // GIVEN
            const towers = copyTowers();

            // WHEN
            const moveIsValid = checkMove(towers, 1, 0, { x: 2, y: 2 });

            // EXPECTED
            assert.isTrue(moveIsValid);
        });

        it('should return true on a left diagonal move of second player', function () {
            // GIVEN
            const towers = copyTowers();

            // WHEN
            const moveIsValid = checkMove(towers, 1, 7, { x: 5, y: 2 });

            // EXPECTED
            assert.isTrue(moveIsValid);
        });

        it('should return false on an invalid move', function () {
            // GIVEN
            const towers = copyTowers()

            // WHEN
            const moveIsValid = checkMove(towers, 0, 4, { x: 5, y: 3 });

            // EXPECTED
            assert.isFalse(moveIsValid);
        });

        it('should return false on an upward move of player one', function () {
            // GIVEN
            const towers = copyTowers();
            towers[0][4].y = 4;

            // WHEN
            const moveIsValid = checkMove(towers, 0, 4, { x: 4, y: 0 });

            // EXPECTED
            assert.isFalse(moveIsValid);
        });

        it('should return false on a downward move of player two', function () {
            // GIVEN
            const towers = copyTowers();
            towers[1][4].y = 3;

            // WHEN
            const moveIsValid = checkMove(towers, 1, 4, { x: 4, y: 7 });

            // EXPECTED
            assert.isFalse(moveIsValid);
        });
    });

    describe('canMove', function () {
        it('should return false when a tower can not be moved anymore', function () {
            // GIVEN
            const towers = copyTowers();
            towers[0][4].y = 6;

            // WHEN
            const canBeMoved = canMove(towers, 0, 4);

            // EXPECTED
            assert.isFalse(canBeMoved);
        });
        
        it('should return false when a left tower can not be moved anymore', function () {
            // GIVEN
            const towers = copyTowers();
            towers[0][0].y = 6;

            // WHEN
            const canBeMoved = canMove(towers, 0, 0);

            // EXPECTED
            assert.isFalse(canBeMoved);
        });
        
        it('should return false when a right tower can not be moved anymore', function () {
            // GIVEN
            const towers = copyTowers();
            towers[0][7].y = 6;

            // WHEN
            const canBeMoved = canMove(towers, 0, 7);

            // EXPECTED
            assert.isFalse(canBeMoved);
        });
    });
});