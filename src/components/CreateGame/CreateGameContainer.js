import { connect } from 'react-redux';
import CreateGame from './native/CreateGame';
import { searchForPlayers, startGame, updateGame, popPageUntil } from '../../actions/index';
import { PAGES } from '../../models/Page';

const mapStateToProps = (state) => ({
    players: state.app.players,
    searchStr: state.app.searchStr,
    player: state.app.player,
    isLoading: state.app.isLoading
});

const mapDispatchToProps = dispatch => ({
    startGame: (playerID, opponentID, players) => {
        dispatch(startGame(playerID, opponentID, players))
    },
    searchForPlayers: searchStr => {
        dispatch(searchForPlayers(searchStr));
    },
    goToDashboard: () => {
        dispatch(popPageUntil(PAGES.DASHBOARD));
    }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateGame);
