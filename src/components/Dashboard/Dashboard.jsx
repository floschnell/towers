import React from 'react';
import { hashHistory } from 'react-router';
import firebase from 'firebase';
import db from '../../database';

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
        return <li key={key} onClick={chooseGame}>Game: {key}</li>;
      });
    };
    
    const startNewGame = () => {
      hashHistory.push('newGame.html');
    };
    
    return <div className="dashboard">
            <div className="dashboard__start-button" onClick={startNewGame}>Neues Spiel Starten</div>
            <ul className="dashboard__list">{renderGames()}</ul>
          </div>;
  }
}