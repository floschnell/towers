import { connect } from 'react-redux';
import Dashboard from './Dashboard';
import { newGame } from '../../actions/index';

const mapStateToProps = (state, ownProps) => ({
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    loadGames: database => {
        database.ref('games').on('value', snapshot => {
            dispatch(newGame(snapshot.val()));
        });
    }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard);