import {connect} from 'react-redux';
import CreateGame from './native/CreateGame';
import {searchForPlayers, popPageUntil, requestGame} from '../../actions/index';
import {PAGES} from '../../models/Page';

const mapStateToProps = (state) => ({
  players: state.app.players,
  searchStr: state.app.searchStr,
  player: state.app.player,
  isLoading: state.app.isLoading,
});

const mapDispatchToProps = (dispatch) => ({
  startGame: (opponent) => {
    dispatch(requestGame(opponent, opponent.id));
  },
  searchForPlayers: (searchStr) => {
    dispatch(searchForPlayers(searchStr));
  },
  goToDashboard: () => {
    dispatch(popPageUntil(PAGES.DASHBOARD));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateGame);
