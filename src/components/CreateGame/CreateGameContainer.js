import { connect } from 'react-redux';
import CreateGame from './native/CreateGame';
import db from '../../database';
import { updatePlayers, startGame, updateGame } from '../../actions/index';
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
  
    startGame: (player, opponent) => {
        dispatch(startGame(player.uid, opponent.uid, {
            [player.uid]: player.val,
            [opponent.uid]: opponent.val
        }));
    }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateGame);