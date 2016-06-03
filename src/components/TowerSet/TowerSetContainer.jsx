import { connect } from 'react-redux';
import TowerSet from './TowerSet';

const mapStateToProps = (state, ownProps) => ({
    towers: state.game.towerPositions[ownProps.player]
});

const mapDispatchToProps = (dispatch, ownProps) => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TowerSet);