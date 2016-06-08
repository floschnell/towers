import { connect } from 'react-redux';
import Dashboard from './Dashboard';
import { updateGames, resumeGame, startGame } from '../../actions/index';
import { hashHistory } from 'react-router';

const mapStateToProps = (state, ownProps) => ({
    playerName: state.app.playerName,
    games: state.app.games
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    updateGames: (playerName) => updateGames(dispatch, playerName), 
    chooseGame: game => {
        dispatch(resumeGame(game));
        hashHistory.push('main.html');
    }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard);