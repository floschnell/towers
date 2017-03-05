import React from 'react';
import { hashHistory } from 'react-router';
import firebase from 'firebase';
import { getOpponent } from '../../gamelogic';
import css from './Dashboard.styl';

export default class Dashboard extends React.Component {
  
  constructor() {
    super();
    this.updateHandler = null;
  }

  componentWillMount() {
    this.updateHandler = this.props.updateGames(this.props.player.uid);
  }

  componentWillUnmount() {
    if (this.updateHandler && this.props.player) {
      db.ref(`players/${this.props.player.uid}/games`).off('value', this.stopHandleUpdates);
    }
  }
  
  render() {

    const renderGames = () => {
      return Object.keys(this.props.games).map(key => {
        const chooseGame = this.props.chooseGame.bind(null, key);
        const game = this.props.games[key];
        const playerUID = this.props.player.uid;
        const opponentUID = getOpponent(playerUID, Object.keys(game.players));
        const opponentName = game.players[opponentUID].name;
        const myTurn = game.currentPlayer === playerUID;

        return <li className="dashboard__game" key={key} onClick={chooseGame}>
          {myTurn ? `It is your turn in the game against ${opponentName}!` : `Waiting for ${opponentName} to take his turn ...`}
        </li>;
      });
    };
    
    const startNewGame = () => {
      hashHistory.push('newGame.html');
    };

    const gameKeys = Object.keys(this.props.games);
    const gameList = gameKeys.length > 0 ?
      <div><p>These are your currently running games, click on one to continue:</p>
        <ul className="dashboard__list">{renderGames()}</ul>
      </div> : <div><p>You currently do not have any games, start one!</p></div>;
    
    return <div className="dashboard">
            <div className="dashboard__start-button" onClick={startNewGame}>Start new game</div>
            {gameList}
          </div>;
  }
}