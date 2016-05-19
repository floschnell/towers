import { connect } from 'react-redux';
import Tower from '../components/Tower';

const mapStateToProps = (state, ownProps) => ({
    isActive: (ownProps.tower.belongsToPlayer === state.game.currentPlayer) && (typeof state.game.currentColor === 'undefined' || state.game.currentColor === ownProps.tower.color)
});

const mapDispatchToProps = (dispatch, ownProps) => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Tower);