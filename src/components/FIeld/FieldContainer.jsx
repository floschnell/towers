import { connect } from 'react-redux';
import Field from './Field';
import {newGame, clickOnField} from '../../actions/index';

const mapStateToProps = (state, ownProps) => ({
    tower: state.game.towerPositions[`${ownProps.y}-${ownProps.x}`],
    playerName: state.app.playerName,
    currentGame: state.app.currentGame,
    fieldSize: state.app.surfaceSize / 8,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    onClick: (playerName, currentGame) => {
        dispatch(clickOnField({
            x: ownProps.x,
            y: ownProps.y,
            color: ownProps.color
        }, playerName, currentGame));
    }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Field);