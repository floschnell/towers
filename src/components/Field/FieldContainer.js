import { connect } from 'react-redux';
import Field from './native/Field';
import {newGame, clickOnField} from '../../actions/index';

const mapStateToProps = (state, ownProps) => ({
    tower: state.game.towerPositions[`${ownProps.y}-${ownProps.x}`],
    playerUid: state.app.player.uid,
    currentGame: state.app.currentGame
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    onClick: (playerUid, currentGame) => {
        dispatch(clickOnField({
            x: ownProps.x,
            y: ownProps.y,
            color: ownProps.color
        }, playerUid, currentGame));
    }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Field);