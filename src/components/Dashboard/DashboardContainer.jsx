import { connect } from 'react-redux';
import Dashboard from './Dashboard';
import { updateGames, resumeGame, startGame, updateGame } from '../../actions/index';
import { hashHistory } from 'react-router';
import db from '../../database.js';

const mapStateToProps = (state, ownProps) => ({
    player: state.app.player,
    games: state.app.games
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    updateGames: (playerUid) => updateGames(dispatch, playerUid), 
    chooseGame: game => {
        dispatch(resumeGame(game));
        db.ref(`games/${game}`).on('value', snapshot => {
            const gameState = snapshot.val();
            dispatch(updateGame(gameState));
            hashHistory.push('main.html');
        });
        
    }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard);