import { connect } from 'react-redux';
import Dashboard from './native/Dashboard';
import { updateGames, resumeGame, startGame, updateGame, startLoading, endLoading } from '../../actions/index';
import { hashHistory } from 'react-router';
import db from '../../database.js';
import {Actions} from 'react-native-router-flux'

const mapStateToProps = (state, ownProps) => ({
    player: state.app.player,
    games: state.app.games,
    isLoading: state.app.isLoading
});

let playerGamesRef = null;
let subscriptionRef = null;

const mapDispatchToProps = (dispatch, ownProps) => ({
    unsubscribeFromGameUpdates: () => {
        playerGamesRef.off('value', subscriptionRef);
    },
    subscribeOnGameUpdates: (playerUid) => {
        playerGamesRef = db.ref(`players/${playerUid}/games`);
        
        subscriptionRef = playerGamesRef.on('value', snapshot => {
            const games = snapshot.val() || [];
            const gamePromises = games.map(game => {
                return db.ref(`games/${game}`).once('value');
            });
            
            Promise.all(gamePromises).then(games => {
                const mapGameToDetails = {};

                games.forEach(game => {
                    if (game.exists()) {
                        mapGameToDetails[game.key] = game.val();
                    }
                });
                console.log('updateGames:', mapGameToDetails);

                dispatch(updateGames(mapGameToDetails));
            });
        });
    }, 
    chooseGame: (key, game) => {
        dispatch(startLoading());
        dispatch(resumeGame(key));
        console.log('choose game:', key);
        return db.ref(`games/${key}`).once('value').then(snapshot => {
            const gameState = snapshot.val();
            console.log('got new state:', gameState);
            dispatch(updateGame(gameState));
            dispatch(endLoading());
        }).catch(e => {
            dispatch(endLoading());
        })
    }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard);