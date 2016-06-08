import { connect } from 'react-redux';
import Tower from './Tower';
import { clickOnTower } from '../../actions/index';

const mapStateToProps = (state, ownProps) => {
  
  const tower = state.game.towerPositions[ownProps.player][ownProps.color];
  
  return {
    tower,
    isActive: (ownProps.color === state.game.game.currentColor || typeof state.game.game.currentColor === 'undefined') && ownProps.player === state.game.game.currentPlayer,
    isSelected: (ownProps.color === state.game.game.currentColor || (typeof state.game.game.currentColor === 'undefined' && state.game.selectedField && state.game.selectedField.x === tower.x && state.game.selectedField.y === tower.y)) && ownProps.player === state.game.game.currentPlayer,
    playerName: state.app.playerName,
    fieldSize: state.app.surfaceSize / 8
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  clickOnTower: (tower, playerName) => {
    dispatch(clickOnTower(tower, playerName));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Tower);