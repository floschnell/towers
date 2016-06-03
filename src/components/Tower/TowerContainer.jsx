import { connect } from 'react-redux';
import Tower from './Tower';
import { clickOnTower } from '../../actions/index';

const mapStateToProps = (state, ownProps) => ({
    tower: state.game.towerPositions[ownProps.player][ownProps.color],
    isActive: (ownProps.color === state.game.game.currentColor || typeof state.game.game.currentColor === 'undefined') && ownProps.player === state.game.game.currentPlayer,
    playerName: state.app.playerName
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  clickOnTower: (tower, playerName) => {
    dispatch(clickOnTower(tower, playerName));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Tower);