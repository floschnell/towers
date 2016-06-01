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
  updatePlayerResults: searchStr => {
    db.ref(`players`).orderByKey().startAt(`${searchStr}`).endAt(`${searchStr}\uf8ff`).limitToFirst(10).on('value', snapshot => {
        if (snapshot.exists()) {
            dispatch(updatePlayers(searchStr, snapshot.val()));
        } else {
            dispatch(updatePlayers(searchStr, []));
        }
    });
  },
  
  startGame: (playerName, opponentName) => {
    db.ref(`players/${opponentName}`).once('value', opponent => {
        if (opponent.exists()) {
            db.ref(`players/${playerName}`).once('value', player => {
                if (player.exists()) {
                    
                    // generate game name
                    let gameName = '';
                    if (playerName < opponentName) {
                        gameName = `${playerName.toLowerCase()}-${opponentName.toLowerCase()}`;
                    } else {
                        gameName = `${opponentName.toLowerCase()}-${playerName.toLowerCase()}`;
                    }
                    
                    // check player is not playing against opponent already
                    db.ref(`games/${gameName}`).once('value', game => {
                        if (game.exists()) {
                            console.warn('game exists already!');
                        } else {
                            const playerObj = player.val();
                            const opponentObj = opponent.val();
                            playerObj.games = playerObj.games || [];
                            playerObj.games.push(gameName);
                            db.ref(`players/${playerName}`).update(playerObj);
                            opponentObj.games = opponentObj.games || [];
                            opponentObj.games.push(gameName);
                            db.ref(`players/${opponentName}`).update(opponentObj);
                            dispatch(startGame(gameName, [playerName, opponentName]));
                            hashHistory.push('main.html');
                        }
                    });
                }
            })
        }
    });
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateGame);