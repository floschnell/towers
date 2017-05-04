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

interface Field {
  x: number,
  y: number,
  color: number
}

interface Move {
  color: number,
  player: string,
  sourceField: Field,
  targetField: Field
}

interface Game {
  currentColor: number,
  currentPlayer: string,
  moves: Array<Move>,
  players: Object
}

declare interface Page {
  name: string,
  title: string,
  backButton: string
}
