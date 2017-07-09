import { connect } from 'react-redux';
import Dashboard from './native/Dashboard';

import {
  pushPage,
  startListeningForGamelistUpdates,
  startListeningForGameRequests,
  stopListeningForGamelistUpdates,
  stopListeningForGameRequests,
  loadGameFromKey,
  launchTutorial,
  startGameAgainstAI,
  acceptGameRequest,
  declineGameRequest,
} from '../../actions/index';

import { PAGES } from '../../models/Page';

const mapStateToProps = (state, ownProps) => ({
  player: state.app.player,
  games: state.app.games,
  isLoading: state.app.isLoading,
  loadingMessage: state.app.loadingMessage,
  requests: state.app.requests,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  playTutorial: (player) => {
    dispatch(launchTutorial(player));
  },
  playAgainstPC: (player) => {
    dispatch(startGameAgainstAI(player));
  },
  unsubscribeFromGameUpdates: (playerID) => {
    dispatch(stopListeningForGamelistUpdates(playerID));
  },
  unsubscribeFromRequests: (playerID) => {
    dispatch(stopListeningForGameRequests(playerID));
  },
  subscribeOnRequests: (playerID) => {
    dispatch(startListeningForGameRequests(playerID));
  },
  subscribeOnGameUpdates: (playerID) => {
    dispatch(startListeningForGamelistUpdates(playerID));
  },
  chooseGame: (gameKey) => {
    dispatch(loadGameFromKey(gameKey));
  },
  startNewGame: () => {
    dispatch(pushPage(PAGES.CREATE_GAME.withTitle('Start New Game')));
  },
  acceptRequest: (player, opponent) => {
    dispatch(acceptGameRequest(player, opponent));
  },
  declineRequest: (playerID, opponentID) => {
    dispatch(declineGameRequest(playerID, opponentID));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
