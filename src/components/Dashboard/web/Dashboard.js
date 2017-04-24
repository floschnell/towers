import React from 'react';
import { hashHistory } from 'react-router';
import firebase from 'firebase';
import { getOpponent } from '../../../gamelogic';
import css from './Dashboard.styl';
import Logger from '../../../logger';

export default class Dashboard extends React.Component {
  
  constructor() {
    super();
  }

  componentWillMount() {
    this.props.subscribeOnGameUpdates(this.props.player.id);
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
                this.props.chooseGame(key);
            }
        };
        Logger.debug('games:', this.props.games);
        const game = this.props.games[key];
        const playerIDs = Object.keys(game.players);
        const playerID = this.props.player.id;
        const opponentID = getOpponent(playerID, playerIDs);
        const opponentName = game.players[opponentID].name;
        const myTurn = game.currentPlayer === playerID;

        return <li className="dashboard__game" key={key} onClick={chooseGame}>
          {myTurn ? `It is your turn in the game against ${opponentName}!` : `Waiting for ${opponentName} to take his turn ...`}
        </li>;
      });
    };
    
    const startNewGame = () => {
      this.props.startNewGame();
    };

    return <div className="dashboard">
            <div className="dashboard__button" onClick={this.props.startNewGame}>Start new game</div>
            <div className="dashboard__button" onClick={this.props.playAgainstPC.bind(null, this.props.player)}>Start game against AI</div>
            {renderGamelist()}
          </div>;
  }
}