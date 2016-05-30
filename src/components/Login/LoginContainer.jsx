import { connect } from 'react-redux';
import Login from './Login';
import {setPlayerName} from '../../actions/index';
import db from '../../database';
import passwordHash from 'password-hash';
import { hashHistory } from 'react-router';

const mapStateToProps = (state, ownProps) => ({
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    finalizeLogin: (playerName, password) => {
        const hashedPassword = passwordHash.generate(password);
        db.ref(`players/${playerName}`).once('value').then(snapshot => {
            const player = snapshot.val();
            if (player) {
                if (passwordHash.verify(password, player.pass)) {
                    dispatch(setPlayerName(playerName));
                    hashHistory.push('dashboard.html');
                } else {
                    console.log('Wrong password! Try again ...');
                }
            }
        });
    }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);