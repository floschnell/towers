import { connect } from 'react-redux';
import CreateGame from './CreateGame';
import db from '../../database';
import { updatePlayers, startGame } from '../../actions/index';
import { hashHistory } from 'react-router';
import firebase from 'firebase';

const mapStateToProps = (state) => ({
    players: state.app.players,
    searchStr: state.app.searchStr,
    playerUid: state.app.player.uid
});

const mapDispatchToProps = (dispatch) => ({

    updatePlayerResults: (searchStr) => {
        const currentUser = firebase.auth().currentUser;
        const searchStart = searchStr;
        const searchEnd = `${searchStart}\uf8ff`;
        db.ref('players').orderByChild('searchName').startAt(searchStart).endAt(searchEnd).on('value', snapshot => {
            if (snapshot.exists()) {
                console.log(snapshot);
                const playersObj = snapshot.val();
                if (playersObj[currentUser.uid]) {
                    delete playersObj[currentUser.uid];
                }
                dispatch(updatePlayers(searchStr, playersObj));
            } else {
                dispatch(updatePlayers(searchStr, []));
            }
        });
    },
  
    startGame: (playerName, opponentName) => {
        let gameName = '';
        if (playerName < opponentName) {
            gameName = `${playerName}-${opponentName}`;
        } else {
            gameName = `${opponentName}-${playerName}`;
        }
        const playerRef = db.ref(`players/${playerName}`);
        const opponentRef = db.ref(`players/${opponentName}`);
        const gameRef = db.ref(`games/${gameName}`);
        
        opponentRef.once('value').then(opponent => {
            if (!opponent.exists()) {
                throw 'Opponent does not exist in database!';
            }
            return playerRef.once('value');
        }).then(player => {
            if (!player.exists()) {
                throw 'Player does not exist in database!';
            }
            return gameRef.once('value');
        }).then(game => {
            if (game.exists()) {
                throw 'Game exists already!';
            }
            const updateGame = gamesObj => {
                gamesObj = gamesObj || [];
                gamesObj.push(gameName);
                return gamesObj;
            };
            db.ref(`players/${playerName}/games`).transaction(updateGame);
            db.ref(`players/${opponentName}/games`).transaction(updateGame);
            dispatch(startGame(gameName, [playerName, opponentName]));
            hashHistory.push('main.html');
        }).catch(err => {
            console.log('Could not start game becouse:', err);
        });
    }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateGame);