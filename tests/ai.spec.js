import Game from '../src/models/Game';
import AI from '../src/ai';

describe('AI', () => {
  it('should be able to make a move', () => {
    // GIVEN
    const game = Game.initialize({});
    const ai = new AI({aggressiveness: 1, blockedPenalty: 1, couldFinishBonus: 1});

    // WHEN
    const move = ai.getNextMove({
      board: game.board,
      currentColor: 0,
      currentPlayer: 'flo',
      players: {
        flo: {name: 'Flo'},
        dumbo: {name: 'Dumbo'},
      },
    });

    // THEN
    expect(move.from.x).toEqual(7);
    expect(move.from.y).toEqual(7);
    expect(move.to.x).toBeLessThanOrEqual(7);
    expect(move.to.y).toBeLessThan(7);
  });
});
