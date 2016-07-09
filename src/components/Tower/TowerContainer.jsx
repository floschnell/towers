import { connect } from 'react-redux';
import Tower from './Tower';
import { clickOnTower } from '../../actions/index';

const mapStateToProps = (state, ownProps) => {
  
  const tower = state.game.towerPositions[ownProps.player][ownProps.color];
  const currentPlayerNumber = state.game.players.findIndex(uid => uid === state.game.currentPlayer);

  return {
    tower,
    isActive: (ownProps.color === state.game.currentColor || typeof state.game.currentColor === 'undefined') && ownProps.player === currentPlayerNumber,
    isSelected: (ownProps.color === state.game.currentColor || (typeof state.game.currentColor === 'undefined' && state.game.selectedField && state.game.selectedField.x === tower.x && state.game.selectedField.y === tower.y)) && ownProps.player === currentPlayerNumber,
    playerName: state.app.playerName
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