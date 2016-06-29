import GameLogic, { copyTowers } from '../src/gamelogic';
import { assert } from 'chai';
import initialTowers from './resources/towers.json';
import deepAssign from 'deep-assign';

describe('Game Logic', () => {

    describe('copyTowers', () => {
        it('should return a deep copy of a tower structure.', () => {
            // WHEN
            const copyOfTowers = copyTowers(initialTowers);
            copyOfTowers[0][0].color = 1;
            copyOfTowers[0][0].player = 1;
            copyOfTowers[0][0].x = 4;
            copyOfTowers[0][0].y = 4;

            // THEN
            assert.equal(initialTowers[0][0].color, 0);
            assert.equal(initialTowers[0][0].player, 0);
            assert.equal(initialTowers[0][0].x, 0);
            assert.equal(initialTowers[0][0].y, 0);
        })
    });

    describe('checkMove', () => {
        it('should return true on a straight move of first player', () => {
            // GIVEN
            const towers = copyTowers(initialTowers);

            // WHEN
            const moveIsValid = GameLogic.checkMove(towers, 0, 0, { x: 0, y: 5 });

            // THEN
            assert.isTrue(moveIsValid);
        });

        it('should return true on a right diagonal move of first player', () => {
            // GIVEN
            const towers = copyTowers(initialTowers);

            // WHEN
            const moveIsValid = GameLogic.checkMove(towers, 0, 0, { x: 5, y: 5 });

            // THEN
            assert.isTrue(moveIsValid);
        });

        it('should return true on a left diagonal move of first player', () => {
            // GIVEN
            const towers = copyTowers(initialTowers);

            // WHEN
            const moveIsValid = GameLogic.checkMove(towers, 0, 7, { x: 2, y: 5 });

            // THEN
            assert.isTrue(moveIsValid);
        });

        it('should return true on a straight move of second player', () => {
            // GIVEN
            const towers = copyTowers(initialTowers);

            // WHEN
            const moveIsValid = GameLogic.checkMove(towers, 1, 0, { x: 7, y: 2 });

            // THEN
            assert.isTrue(moveIsValid);
        });

        it('should return true on a right diagonal move of second player', () => {
            // GIVEN
            const towers = copyTowers(initialTowers);

            // WHEN
            const moveIsValid = GameLogic.checkMove(towers, 1, 0, { x: 2, y: 2 });

            // THEN
            assert.isTrue(moveIsValid);
        });

        it('should return true on a left diagonal move of second player', () => {
            // GIVEN
            const towers = copyTowers(initialTowers);

            // WHEN
            const moveIsValid = GameLogic.checkMove(towers, 1, 7, { x: 5, y: 2 });

            // THEN
            assert.isTrue(moveIsValid);
        });

        it('should return false on an invalid move', () => {
            // GIVEN
            const towers = copyTowers(initialTowers)

            // WHEN
            const moveIsValid = GameLogic.checkMove(towers, 0, 4, { x: 5, y: 3 });

            // THEN
            assert.isFalse(moveIsValid);
        });

        it('should return false on an upward move of player one', () => {
            // GIVEN
            const towers = copyTowers(initialTowers);
            towers[0][4].y = 4;

            // WHEN
            const moveIsValid = GameLogic.checkMove(towers, 0, 4, { x: 4, y: 0 });

            // THEN
            assert.isFalse(moveIsValid);
        });

        it('should return false on a downward move of player two', () => {
            // GIVEN
            const towers = copyTowers(initialTowers);
            towers[1][4].y = 3;

            // WHEN
            const moveIsValid = GameLogic.checkMove(towers, 1, 4, { x: 4, y: 7 });

            // THEN
            assert.isFalse(moveIsValid);
        });
    });

    describe('canMove', () => {
        it('should return false when a tower can not be moved anymore', () => {
            // GIVEN
            const towers = copyTowers(initialTowers);
            towers[0][4].y = 6;

            // WHEN
            const canBeMoved = GameLogic.canMove(towers, 0, 4);

            // THEN
            assert.isFalse(canBeMoved);
        });
        
        it('should return false when a left tower can not be moved anymore', () => {
            // GIVEN
            const towers = copyTowers(initialTowers);
            towers[0][0].y = 6;

            // WHEN
            const canBeMoved = GameLogic.canMove(towers, 0, 0);

            // THEN
            assert.isFalse(canBeMoved);
        });
        
        it('should return false when a right tower can not be moved anymore', () => {
            // GIVEN
            const towers = copyTowers(initialTowers);
            towers[0][7].y = 6;

            // WHEN
            const canBeMoved = GameLogic.canMove(towers, 0, 7);

            // THEN
            assert.isFalse(canBeMoved);
        });
    });

    describe('executeMove', () => {
        it('should be able to move a tower', () => {
            // GIVEN
            const towers = copyTowers(initialTowers);

            // WHEN
            const updatedTowers = GameLogic.executeMove(towers, {x: 0, y: 0}, {x: 3, y: 5});

            // THEN
            assert.equal(updatedTowers[0][0].x, 3);
            assert.equal(updatedTowers[0][0].y, 5);
        });

        it('should fail with an exception if tower does not exist', () => {
            // GIVEN
            const towers = copyTowers(initialTowers);
            let error = null;

            // WHEN
            try {
                GameLogic.executeMove(towers, {x: 1, y: 1}, {x: 3, y: 5});
            } catch (e) {
                error = e;
            }

            // THEN
            assert.isNotNull(error);
        });

        it('should fail with an exception if tower destination is already occupied', () => {
            // GIVEN
            const towers = copyTowers(initialTowers);
            let error = null;

            // WHEN
            try {
                GameLogic.executeMove(towers, {x: 0, y: 0}, {x: 7, y: 7});
            } catch (e) {
                error = e;
            }

            // THEN
            assert.isNotNull(error);
        });
    });

    describe('executeMoves', () => {
        it('should be able to execute a sequence of moves', () => {
            // GIVEN
            const towers = copyTowers(initialTowers);
            const move1 = {
                player: 0,
                color: 0,
                from: {x:0, y:0},
                to: {x:0, y:3}
            };
            const move2 = {
                player: 1,
                color: 3,
                from: {x:4, y:7},
                to: {x:4, y:2}
            };
            const move3 = {
                player: 0,
                color: 0,
                from: {x:0, y:3},
                to: {x:2, y:5}
            };
            const moves = [move1, move2, move3];

            // WHEN
            const resultingTowers = GameLogic.executeMoves(initialTowers, moves);

            // THEN
            assert.deepEqual(resultingTowers[0][0], {x: 2, y: 5, color: 0, player: 0});
            assert.deepEqual(resultingTowers[1][3], {x: 4, y: 2, color: 3, player: 1});
        });

        it('should fail during a sequence of moves if a move is impossible', () => {
            // GIVEN
            const towers = copyTowers(initialTowers);
            const move1 = {
                player: 0,
                color: 0,
                from: {x:0, y:0},
                to: {x:0, y:3}
            };
            const move2 = {
                player: 1,
                color: 3,
                from: {x:4, y:7},
                to: {x:5, y:2}
            };
            const move3 = {
                player: 0,
                color: 0,
                from: {x:0, y:3},
                to: {x:2, y:5}
            };
            const moves = [move1, move2, move3];
            let error = null;

            // WHEN
            try {
                const resultingTowers = GameLogic.executeMoves(initialTowers, moves);
            } catch (e) {
                error = e;
            }

            // THEN
            assert.isNotNull(error);
        });
    });
});