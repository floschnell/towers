import { connect } from 'react-redux';
import Board from './Board';

const mapStateToProps = (state) => ({
    fields: state.board
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Board);