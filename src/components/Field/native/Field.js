import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {getColor} from '../../../utils';
import PropTypes from 'prop-types';

/**
 * Native component for a field of the board game.
 */
export default class Field extends React.Component {
  /**
   * @override
   */
  render() {
    const fieldSize = this.props.surfaceSize / 8;

    const renderReachableHint = () => {
      if (this.props.myTurn && this.props.canBeReached) {
        return (
          <View
            style={{
              width: fieldSize * 0.6,
              height: fieldSize * 0.6,
              backgroundColor: this.props.myTurn ? 'black' : 'white',
              opacity: 0.2,
            }}
          />
        );
      }
    };

    const onClick = this.props.onClick.bind(
      null,
      this.props.playerID,
      this.props.opponentID,
      this.props.currentGame
    );

    return (
      <TouchableOpacity activeOpacity={0.5} onPress={onClick}>
        <View
          style={{
            backgroundColor: getColor(this.props.color),
            width: fieldSize,
            height: fieldSize,
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0.8,
          }}
        >
          {renderReachableHint()}
        </View>
      </TouchableOpacity>
    );
  }
}

Field.propTypes = {
  color: PropTypes.number,
  onClick: PropTypes.func,
  playerID: PropTypes.string,
  opponentID: PropTypes.string,
  currentGame: PropTypes.string,
  myTurn: PropTypes.bool,
  canBeReached: PropTypes.bool,
  surfaceSize: PropTypes.number,
};
