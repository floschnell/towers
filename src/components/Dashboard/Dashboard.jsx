import React from 'react';
import { hashHistory } from 'react-router';

export default class Dashboard extends React.Component {
  
  componentWillMount() {
    this.props.loadGames(this.props.playerName);
  }
  
  render() {
    
    const renderGames = () => {
      return Object.keys(this.props.games).map(key => {
        const chooseGame = this.props.chooseGame.bind(null, key);
        return <li key={key} onClick={chooseGame}>Game: {key}</li>;
      });
    };
    
    const startNewGame = () => {
      hashHistory.push('newGame.html');
    };
    
    return <div class="dashboard">
        <div class="dashboard__start-button" onClick={startNewGame}>Neues Spiel Starten</div>
        <ul class="dashboard__list">{renderGames()}</ul>
      </div>;
  }
}