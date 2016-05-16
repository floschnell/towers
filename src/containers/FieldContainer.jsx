import { connect } from 'react-redux';
import Field from '../components/Field';
import {clickOnField} from '../actions/index';

const mapStateToProps = (state, ownProps) => ({
    tower: state.towerPositions[`${ownProps.y}-${ownProps.x}`],
    color: state.board[ownProps.y][ownProps.x].color,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    onClick: () => {
        dispatch(clickOnField({
            x: ownProps.x,
            y: ownProps.y
        }));
    }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Field);