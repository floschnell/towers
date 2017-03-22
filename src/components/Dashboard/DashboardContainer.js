import { connect } from 'react-redux';
import Dashboard from './native/Dashboard';
import db from '../../database.js';
import { pushPage } from '../../actions/index';

import {
    resumeGame,
    updateGame,
    startLoading,
    endLoading,
    startListeningForGamelistUpdates,
    stopListeningForGamelistUpdates,
    loadGameFromKey
} from '../../actions/index';

import { PAGES } from '../../models/Page';

const mapStateToProps = (state, ownProps) => ({
    player: state.app.player,
    games: state.app.games,
    isLoading: state.app.isLoading,
    loadingMessage: state.app.loadingMessage
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    unsubscribeFromGameUpdates: playerID => {
        dispatch(stopListeningForGamelistUpdates(playerID))
    },
    subscribeOnGameUpdates: playerID => {
        dispatch(startListeningForGamelistUpdates(playerID));
    }, 
    chooseGame: gameKey => {
        dispatch(loadGameFromKey(gameKey));
    },
    startNewGame: () => {
        dispatch(pushPage(PAGES.CREATE_GAME.withTitle('Start New Game')));
    }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard);