import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {getColor} from '../../../utils';

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
              borderColor: this.props.myTurn ? 'black' : 'white',
              borderWidth: 3,
              opacity: 0.5,
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
          }}
        >
          {renderReachableHint()}
        </View>
      </TouchableOpacity>
    );
  }
}

Field.propTypes = {
  color: React.PropTypes.number,
  onClick: React.PropTypes.func,
  playerID: React.PropTypes.string,
  opponentID: React.PropTypes.string,
  currentGame: React.PropTypes.string,
  myTurn: React.PropTypes.bool,
  canBeReached: React.PropTypes.bool,
  surfaceSize: React.PropTypes.number,
};
