import { connect } from 'react-redux';
import Dashboard from './native/Dashboard';
import db from '../../database.js';
import {Actions} from 'react-native-router-flux'

import {
    resumeGame,
    updateGame,
    startLoading,
    endLoading,
    startListeningForGamelistUpdates,
    stopListeningForGamelistUpdates,
    loadGame
} from '../../actions/index';

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
    chooseGame: game => {
        dispatch(loadGame(game));
    }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard);