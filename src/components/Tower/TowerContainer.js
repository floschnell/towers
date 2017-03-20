import { connect } from 'react-redux';
import Tower from './native/Tower';
import { clickOnTower } from '../../actions/index';

const mapStateToProps = (state, ownProps) => {
  const tower = ownProps.tower;

  return {
    tower,
    isActive: (tower.color === state.game.currentColor || typeof state.game.currentColor === 'undefined') && tower.belongsToPlayer === state.game.currentPlayer,
    isSelected: (tower.color === state.game.currentColor || typeof state.game.currentColor === 'undefined')
                && ((state.game.selectedTower
                && state.game.selectedTower.x === tower.x
                && state.game.selectedTower.y === tower.y) || !state.game.selectedTower)
                && tower.belongsToPlayer === state.game.currentPlayer,
    playerUid: state.app.player.uid,
    belongsToMe: state.app.player.uid === tower.belongsToPlayer
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  clickOnTower: (tower, playerUid) => {
    console.log('click on tower!');
    dispatch(clickOnTower(tower, playerUid));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Tower);