import { connect } from 'react-redux';
import Game from './Game';

const mapStateToProps = (state, ownProps) => ({
    board: state.board
});

const mapDispatchToProps = (dispatch, ownProps) => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Game);