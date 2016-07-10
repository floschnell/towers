import { connect } from 'react-redux';
import Tower from './Tower';
import { clickOnTower } from '../../actions/index';

const mapStateToProps = (state, ownProps) => {
  
  const tower = state.game.towerPositions[ownProps.player][ownProps.color];
  const currentPlayerNumber = state.game.players[state.game.currentPlayer];

  return {
    tower,
    isActive: (ownProps.color === state.game.currentColor || typeof state.game.currentColor === 'undefined') && ownProps.player === currentPlayerNumber,
    isSelected: (ownProps.color === state.game.currentColor || (typeof state.game.currentColor === 'undefined' && state.game.selectedField && state.game.selectedField.x === tower.x && state.game.selectedField.y === tower.y)) && ownProps.player === currentPlayerNumber,
    playerUid: state.app.player.uid
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  clickOnTower: (tower, playerUid) => {
    dispatch(clickOnTower(tower, playerUid));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Tower);