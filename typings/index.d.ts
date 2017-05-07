interface Tower {
  x: number,
  y: number,
  color: number,
  belongsToPlayer: string
}

interface Player {
  id: string,
  name: string,
  mail: string,
  uid: string,
  games: Array<Object>
}

interface FieldStructure {
  x: number,
  y: number,
  color: number
}

interface MoveStructure {
  color: number,
  player: string,
  sourceField: FieldStructure,
  targetField: FieldStructure
}

interface BoardStructure {
  playerA: string,
  playerB: string,
  data: Uint8Array
}

interface GameStructure {
  currentColor: number,
  currentPlayer: string,
  moves: Array<Move>,
  players: Object,
  board: BoardStructure
}

declare interface Page {
  name: string,
  title: string,
  backButton: string
}
