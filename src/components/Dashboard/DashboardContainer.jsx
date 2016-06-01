import { connect } from 'react-redux';
import Dashboard from './Dashboard';
import { updateGames, resumeGame, startGame } from '../../actions/index';
import db from '../../database';
import { hashHistory } from 'react-router';

const mapStateToProps = (state, ownProps) => ({
    playerName: state.app.playerName,
    games: state.app.games
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    loadGames: (playerName) => {
        db.ref(`players/${playerName}/games`).on('value', snapshot => {
            const games = snapshot.val();
            games.forEach(game => {
                db.ref(`games/${game}`).on('value', snap => {
                    dispatch(updateGames(game, snap.val()));
                })
            });
        });
    },
    
    chooseGame: game => {
        dispatch(resumeGame(game));
        hashHistory.push('main.html');
    }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard);