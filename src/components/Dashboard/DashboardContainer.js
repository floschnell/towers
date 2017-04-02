import { connect } from 'react-redux';
import Dashboard from './native/Dashboard';
import db from '../../database.js';

import {
    pushPage,
    resumeGame,
    updateGame,
    startLoading,
    endLoading,
    startListeningForGamelistUpdates,
    stopListeningForGamelistUpdates,
    loadGameFromKey,
    launchTutorial,
    launchGameAgainstAI
} from '../../actions/index';

import { PAGES } from '../../models/Page';

const mapStateToProps = (state, ownProps) => ({
    player: state.app.player,
    games: state.app.games,
    isLoading: state.app.isLoading,
    loadingMessage: state.app.loadingMessage
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    playTutorial: player => {
        dispatch(launchTutorial(player));
    },
    playAgainstPC: player => {
        dispatch(launchGameAgainstAI(player));
    },
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