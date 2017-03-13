import { connect } from 'react-redux';
import CreateGame from './native/CreateGame';
import { searchForPlayers, startGame, updateGame, goToPage } from '../../actions/index';
import { PAGES } from '../../models/Page';

const mapStateToProps = (state) => ({
    players: state.app.players,
    searchStr: state.app.searchStr,
    player: state.app.player,
    isLoading: state.app.isLoading
});

const mapDispatchToProps = (dispatch) => ({
    startGame: (playerUID, opponentUID, players) => {
        dispatch(startGame(playerUID, opponentUID, players))
    },
    searchForPlayers: searchStr => {
        dispatch(searchForPlayers(searchStr));
    },
    goToDashboard: () => {
        dispatch(goToPage(PAGES.DASHBOARD));
    }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateGame);
