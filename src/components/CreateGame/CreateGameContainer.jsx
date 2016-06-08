import { connect } from 'react-redux';
import CreateGame from './CreateGame';
import db from '../../database';
import { updatePlayers, startGame } from '../../actions/index';
import { hashHistory } from 'react-router';

const mapStateToProps = (state) => ({
    players: state.app.players,
    searchStr: state.app.searchStr,
    playerName: state.app.playerName
});

const mapDispatchToProps = (dispatch) => ({
    updatePlayerResults: (searchStr, playerName) => {
        const searchStart = searchStr.toLowerCase();
        const searchEnd = `${searchStart}\uf8ff`;
        db.ref(`players`).orderByKey().startAt(searchStart).endAt(searchEnd).limitToFirst(10).on('value', snapshot => {
            if (snapshot.exists()) {
                const playersObj = snapshot.val();
                if (playersObj[playerName]) {
                    delete playersObj[playerName];
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
            gameName = `${playerName.toLowerCase()}-${opponentName.toLowerCase()}`;
        } else {
            gameName = `${opponentName.toLowerCase()}-${playerName.toLowerCase()}`;
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
            const updateGame = playerObj => {
                if (playerObj !== null) {
                    playerObj.games = playerObj.games || [];
                    playerObj.games.push(gameName);
                }
                return playerObj;
            };
            playerRef.transaction(updateGame);
            opponentRef.transaction(updateGame);
            dispatch(startGame(gameName, [playerName, opponentName]));
            hashHistory.push('main.html');
        }).catch(err => {
            console.log(`Could not start game becouse: ${err}`);
        });
    }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateGame);