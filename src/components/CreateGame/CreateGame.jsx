import React from 'react';
import { hashHistory } from 'react-router';
import firebase from 'firebase';

export default class CreateGame extends React.Component {

    constructor() {
        super();
        this.playerUid = null;
    }

    componentWillMount() {
        this.playerUid = firebase.auth().currentUser.uid;
    }
  
    render() {

        const renderPlayers = () => {
            return Object.keys(this.props.players).map(uid => {
                return <li key={uid} onClick={this.props.startGame.bind(null, this.playerUid, uid)}>{this.props.players[uid].name}</li>;
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