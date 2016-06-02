import React from 'react';
import { hashHistory } from 'react-router';

export default class CreateGame extends React.Component {
  
  componentWillMount() {
  }
  
  render() {
    
    const renderPlayers = () => {
        return Object.keys(this.props.players).map(player => {
            return <li key={player} onClick={this.props.startGame.bind(null, this.props.playerName, player)}>{this.props.players[player].name}</li>;
        })
    };
    
    const searchPlayers = () => {
        this.props.updatePlayerResults(this.refs.searchStr.value);
    };
    
    const navigateBack = event => {
        hashHistory.push('dashboard.html');
    }
    
    return <div class="dashboard">
        <div class="dashboard__back-button" onClick={navigateBack}>Zurück</div>
        <input
            ref="searchStr"
            type="text"
            onChange={searchPlayers}
        />
        <ul class="dashboard__list">{renderPlayers()}</ul>        
      </div>;
  }
}