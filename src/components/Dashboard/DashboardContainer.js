import { connect } from 'react-redux';
import Dashboard from './native/Dashboard';
import { updateGames, resumeGame, startGame, updateGame } from '../../actions/index';
import { hashHistory } from 'react-router';
import db from '../../database.js';

const mapStateToProps = (state, ownProps) => ({
    player: state.app.player,
    games: state.app.games
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
                    mapGameToDetails[game.key] = game.val();
                });
                dispatch(updateGames(mapGameToDetails));
            });
        });
    }, 
    chooseGame: game => {
        dispatch(resumeGame(game));
        db.ref(`games/${game}`).on('value', snapshot => {
            const gameState = snapshot.val();
            dispatch(updateGame(gameState));
        });
    }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard);