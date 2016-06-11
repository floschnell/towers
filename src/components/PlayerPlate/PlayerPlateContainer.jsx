import { connect } from 'react-redux';
import PlayerPlate from './PlayerPlate';
import {setPlayerName} from '../../actions/index';
import db from '../../database';

const mapStateToProps = (state, ownProps) => ({
    name: state.game.game[`player${ownProps.player}`]
});

const mapDispatchToProps = (dispatch, ownProps) => ({
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PlayerPlate);