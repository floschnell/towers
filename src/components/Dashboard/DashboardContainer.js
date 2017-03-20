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
    unsubscribeFromGameUpdates: playerUid => {
        dispatch(stopListeningForGamelistUpdates(playerUid))
    },
    subscribeOnGameUpdates: playerUid => {
        dispatch(startListeningForGamelistUpdates(playerUid));
    }, 
    chooseGame: gameKey => {
        dispatch(loadGameFromKey(gameKey));
    },
    startNewGame: () => {
        dispatch(pushPage(PAGES.CREATE_GAME));
    }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard);