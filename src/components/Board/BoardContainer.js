import { connect } from 'react-redux';
import Board from './native/Board';
import db from '../../database';
import { updateGame } from '../../actions/index';

const mapStateToProps = (state) => ({
    fields: state.game.board,
    currentGame: state.app.currentGame
});

const mapDispatchToProps = (dispatch) => ({
  updateGame: game => {
    db.ref(`games/${game}`).on('value', snapshot => {
      dispatch(updateGame(snapshot.val()));
    })
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Board);