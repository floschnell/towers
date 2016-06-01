import React from 'react';

export default class CreateGame extends React.Component {
  
  componentWillMount() {
  }
  
  render() {
    
    const renderPlayers = () => {
        return Object.keys(this.props.players).map(player => {
            return <li key={player} onClick={this.props.startGame.bind(null, this.props.playerName, player)}>{player}</li>;
        })
    };
    
    const searchPlayers = () => {
        this.props.updatePlayerResults(this.refs.searchStr.value);
    };
    
    return <div class="dashboard">
        <input
            ref="searchStr"
            type="text"
            onChange={searchPlayers}
        />
        <ul class="dashboard__list">{renderPlayers()}</ul>        
      </div>;
  }
}