import Game from '../src/models/Game';
import Board, {BoardFactory} from '../src/models/Board';
import Benchmark from 'benchmark';
import fs from 'fs';

const suite = new Benchmark.Suite('Board');
const results = [];
const boardFactory = new BoardFactory();
const oldResults = [];
if (fs.existsSync('./dist/benchmark_results_reference.json')) {
  JSON.parse(
    fs.readFileSync('./dist/benchmark_results_reference.json').toString()
  ).forEach((result) => oldResults.push(result));
}
const board = boardFactory.createBoard();
Board.convertTowerPositionsToBoard(
  Game.createInitialTowerPositions(['playerA', 'playerB']),
  board
);

console.log('Benchmark running ...');

suite
  .add('coordHasTower', () => {
    const x = ~~(Math.random() * 8);
    const y = ~~(Math.random() * 8);

    Board.coordHasTower(board, x, y);
  })
  .add('copy', () => {
    boardFactory.copyBoard(board);
  })
  .add('getTowerForPlayerAndColor', () => {
    const player = Math.random() < 0.5 ? 'playerA' : 'playerB';
    const color = ~~(Math.random() * 8);

    Board.getTowerForPlayerAndColor(board, player, color);
  })
  .add('moveTower', () => {
    const fromX = 3;
    const fromY = 0;
    const toX = 3;
    const toY = 3;

    Board.moveTower(board, 'playerA', 3, fromX, fromY, toX, toY);
    Board.moveTower(board, 'playerA', 3, toX, toY, fromX, fromY);
  })
  .add('getOpponentOf', () => {
    Board.getOpponentOf(board, 'playerA');
    Board.getOpponentOf(board, 'playerB');
  })
  .on('cycle', (event) => {
    console.log('---------------------------');
    console.log(event.target.name);
    console.log('---------------------------');
    console.log('ops/sec:\t', Math.floor(event.target.hz));
    const comparable = oldResults.find(
      (oldResult) => oldResult.name === event.target.name
    );
    if (comparable) {
      const ratio = event.target.hz / comparable.hz - 1;
      console.log('improvement:\t', `${Math.round(ratio * 100)}%`);
    }
    console.log('');
    results.push(event.target);
  })
  .on('complete', () => {
    console.log(boardFactory.size, 'used from', boardFactory.available);
    fs.writeFileSync(
      './dist/benchmark_results.json',
      JSON.stringify(results, null, 2)
    );
  })
  .run({async: false});
