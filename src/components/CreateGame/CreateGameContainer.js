import { connect } from 'react-redux';
import CreateGame from './native/CreateGame';
import db from '../../database';
import { updatePlayers, startGame } from '../../actions/index';
import { hashHistory } from 'react-router';
import firebase from 'firebase';

const mapStateToProps = (state) => ({
    players: state.app.players,
    searchStr: state.app.searchStr,
    player: state.app.player
});

const mapDispatchToProps = (dispatch) => ({

    updatePlayerResults: (searchStr) => {
        const currentUser = firebase.auth().currentUser;
        const searchStart = searchStr;
        const searchEnd = `${searchStart}\uf8ff`;
        db.ref('players').orderByChild('searchName').startAt(searchStart).endAt(searchEnd).on('value', snapshot => {
            if (snapshot.exists()) {
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
  
    startGame: (playerUID, opponentUID) => {
        let gameName = '';

        if (playerUID < opponentUID) {
            gameName = `${playerUID}-${opponentUID}`;
        } else {
            gameName = `${opponentUID}-${playerUID}`;
        }
        const playerRef = db.ref(`players/${playerUID}`);
        const opponentRef = db.ref(`players/${opponentUID}`);
        const gameRef = db.ref(`games/${gameName}`);

        Promise.all([
            opponentRef.once('value'),
            playerRef.once('value'),
            gameRef.once('value')
        ]).then(results => {
            const opponent = results[0];
            const player = results[1];
            const game = results[2];
            const updateGame = gamesObj => {
                gamesObj = gamesObj || [];
                gamesObj.push(gameName);
                return gamesObj;
            };

            if (!opponent.exists()) {
                throw 'Opponent does not exist in database!';
            }
            if (!player.exists()) {
                throw 'Player does not exist in database!';
            }
            if (game.exists()) {
                throw 'Game exists already!';
            }

            dispatch(startGame(gameName, {
                [playerUID]: player.val(),
                [opponentUID]: opponent.val()
            }));

            return Promise.all([
                db.ref(`players/${playerUID}/games`).transaction(updateGame),
                db.ref(`players/${opponentUID}/games`).transaction(updateGame)
            ]);
        }).catch(err => {
            console.log('Could not start game becouse:', err);
        });
    }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateGame);