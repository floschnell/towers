import React from 'react';
import { getOpponent } from '../../../gamelogic';
import './Dashboard.styl';
import Logger from '../../../logger';

/**
 * Dashboard component for the web.
 * This is where a new game can be started
 * or currently running games can be resumed.
 */
export default class Dashboard extends React.Component {
  /**
   * @override
   */
  componentWillMount() {
    this.props.subscribeOnGameUpdates(this.props.player.id);
  }

  /**
   * @override
   */
  componentWillUnmount() {
    this.props.unsubscribeFromGameUpdates();
  }

  /**
   * @override
   */
  render() {
    const renderGamelist = () => {
      const gameKeys = Object.keys(this.props.games);
      if (gameKeys.length > 0) {
        return (
          <div>
            <p>These are your currently running games, click on one to continue:</p>
            <ul className="dashboard__list">{renderGames()}</ul>
          </div>
        );
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

        return (
          <li className="dashboard__game" key={key} onClick={chooseGame}>
            {myTurn
              ? `It is your turn in the game against ${opponentName}!`
              : `Waiting for ${opponentName} to take his turn ...`}
          </li>
        );
      });
    };

    return (
      <div className="dashboard">
        <div className="dashboard__button" onClick={this.props.startNewGame}>
          Start new game
        </div>
        <div
          className="dashboard__button"
          onClick={this.props.playAgainstPC.bind(null, this.props.player)}
        >
          Start game against AI
        </div>
        {renderGamelist()}
      </div>
    );
  }
}

Dashboard.propTypes = {
  playAgainstPC: React.PropTypes.func.isRequired,
  startNewGame: React.PropTypes.func.isRequired,
  chooseGame: React.PropTypes.func.isRequired,
  subscribeOnGameUpdates: React.PropTypes.func.isRequired,
  unsubscribeFromGameUpdates: React.PropTypes.func.isRequired,
  player: React.PropTypes.object,
  games: React.PropTypes.object,
  isLoading: React.PropTypes.bool,
};
