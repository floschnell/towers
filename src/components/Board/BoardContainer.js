import {connect} from 'react-redux';
import Board from './native/Board';

const mapStateToProps = (state) => ({
  fields: state.game.board,
  currentGame: state.app.currentGame,
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Board);
