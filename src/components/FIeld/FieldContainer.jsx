import { connect } from 'react-redux';
import Field from './Field';
import {newGame, clickOnField} from '../../actions/index';

const mapStateToProps = (state, ownProps) => ({
    tower: state.towerPositions[`${ownProps.y}-${ownProps.x}`]
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    onClick: () => {
        dispatch(clickOnField({
            x: ownProps.x,
            y: ownProps.y,
            color: ownProps.color
        }));
    }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Field);