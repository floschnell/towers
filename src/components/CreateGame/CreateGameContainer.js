import { connect } from 'react-redux';
import CreateGame from './native/CreateGame';
import { searchForPlayers, startGame, updateGame } from '../../actions/index';

const mapStateToProps = (state) => ({
    players: state.app.players,
    searchStr: state.app.searchStr,
    player: state.app.player
});

const mapDispatchToProps = (dispatch) => ({
    startGame: (playerUID, opponentUID, players) => {
        dispatch(startGame(playerUID, opponentUID, players))
    },
    searchForPlayers: searchStr => {
        dispatch(searchForPlayers(searchStr));
    }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateGame);