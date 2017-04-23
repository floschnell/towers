import Game from '../src/models/Game';
import Board, {convertTowerPositionsToBoard} from '../src/models/Board';
import Benchmark from 'benchmark';

const board = convertTowerPositionsToBoard(Game.createInitialTowerPositions(['playerA', 'playerB']))
const suite = new Benchmark.Suite('Board');
const results = [];

suite.add('coordHasTower', () => {
    const x = ~~(Math.random() * 8);
    const y = ~~(Math.random() * 8);

    Board.coordHasTower(board, x, y);
}).add('copy', () => {
    const boardCopy = Board.copy(board);
}).add('getTowerForPlayerAndColor', () => {
    const player = Math.random() < 0.5 ? 'playerA' : 'playerB';
    const color = ~~(Math.random() * 8);

    Board.getTowerForPlayerAndColor(board, player, color);
}).add('moveTower', () => {
    const fromX = 3;
    const fromY = 0;
    const toX = 3;
    const toY = 3;

    Board.moveTower(board, 'playerA', 3, fromX, fromY, toX, toY);
    Board.moveTower(board, 'playerA', 3, toX, toY, fromX, fromY);
}).add('getOpponentOf', () => {
    Board.getOpponentOf(board, 'playerA');
    Board.getOpponentOf(board, 'playerB');
}).on('cycle', event => {
    results.push(event.target);
}).on('complete', () => {
    console.log(JSON.stringify(results, null, 2));
}).run({ 'async': false });
