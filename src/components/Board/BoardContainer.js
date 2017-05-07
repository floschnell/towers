import {connect} from 'react-redux';
import Board from './native/Board';
import {BOARD_COLORS} from '../../models/Board';

const mapStateToProps = (state) => ({
  fields: BOARD_COLORS,
  currentGame: state.app.currentGame,
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Board);
