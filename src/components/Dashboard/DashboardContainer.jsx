import { connect } from 'react-redux';
import Dashboard from './Dashboard';
import { updateGames, resumeGame, startGame } from '../../actions/index';
import { hashHistory } from 'react-router';

const mapStateToProps = (state, ownProps) => ({
    player: state.app.player,
    games: state.app.games
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    updateGames: (playerUid) => updateGames(dispatch, playerUid), 
    chooseGame: game => {
        dispatch(resumeGame(game));
        hashHistory.push('main.html');
    }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard);