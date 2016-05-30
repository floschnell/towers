import React from 'react';

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
    
    return <div class="dashboard">
        <ul class="dashboard__list">{renderGames()}</ul>
        <div class="dashboard__start-button">Neues Spiel Starten</div>
      </div>;
  }
}