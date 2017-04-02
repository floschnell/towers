import React from 'react';
import { hashHistory } from 'react-router';
import firebase from 'firebase';
import { getOpponent } from '../../../gamelogic';
import css from './Dashboard.styl';

export default class Dashboard extends React.Component {
  
  constructor() {
    super();
  }

  componentWillMount() {
    this.props.subscribeOnGameUpdates(this.props.player.uid);
  }

  componentWillUnmount() {
    this.props.unsubscribeFromGameUpdates();
  }
  
  render() {

    const renderGamelist = () => {
      const gameKeys = Object.keys(this.props.games);
      if (gameKeys.length > 0) {
        return <div><p>These are your currently running games, click on one to continue:</p>
          <ul className="dashboard__list">{renderGames()}</ul>
        </div>;
      } else {
        return <div><p>You currently do not have any games, start one!</p></div>;
      }
    };

    const renderGames = () => {
      return Object.keys(this.props.games).map(key => {
        const chooseGame = () => {
            if (!this.props.isLoading) {
                this.props.chooseGame(game);
            }
        };
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
      this.props.startNewGame();
    };
    
    return <div className="dashboard">
            <div className="dashboard__start-button" onClick={startNewGame}>Start new game</div>
            {renderGamelist()}
          </div>;
  }
}