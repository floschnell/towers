import { connect } from 'react-redux';
import CreateAccount from './CreateAccount';
import {setPlayerName} from '../../actions/index';
import db from '../../database';
import passwordHash from 'password-hash';
import { hashHistory } from 'react-router';

const mapStateToProps = (state, ownProps) => ({
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    createAccount: (playerName, password, passwordRepeat) => {
        const playerId = playerName.toLowerCase();
        const playerRef = db.ref(`players/${playerId}`);
        if (password === passwordRepeat) {
            playerRef.once('value').then(player => {
                if (player.exists()) {
                    throw 'Account exists already!';
                }
                const hashedPassword = passwordHash.generate(password);
                return playerRef.set({
                    pass: hashedPassword,
                    name: playerName
                });
            }).then(result => {
                console.log('player has been successfully created!');
                dispatch(setPlayerName(playerName));
                hashHistory.push('dashboard.html');
            }).catch(err => {
                console.warn(`player could not be created because ${err}`);
            })
        }
    }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateAccount);