import React from 'react';
import { hashHistory } from 'react-router';
import firebase from 'firebase';

export default class CreateGame extends React.Component {

    constructor() {
        super();
    }
  
    render() {
        const renderPlayers = () => {
            return Object.keys(this.props.players).map(opponentUID => {
                const playerUID = this.props.player.uid;
                const player = this.props.player;
                const opponent = this.props.players[opponentUID];
                const startGameOnClick = () => {
                    this.props.startGame(playerUID, opponentUID, {
                        [playerUID]: player,
                        [opponentUID]: opponent
                    });
                };

                return <li key={uid} onClick={startGameOnClick}>{this.props.players[uid].name}</li>;
            })
        };

        const searchPlayers = () => {
            this.props.searchForPlayers(this.refs.searchStr.value);
        };

        const navigateBack = event => {
            hashHistory.push('dashboard.html');
        }

        return <div className="dashboard">
            <div className="dashboard__back-button" onClick={navigateBack}>Zurück</div>
            <input
                ref="searchStr"
                type="text"
                onChange={searchPlayers}
            />
            <ul className="dashboard__list">{renderPlayers()}</ul>        
            </div>;
    }
}