import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { getColor } from '../../../utils';

export default class Field extends React.Component {
  render() {
    const fieldSize = this.props.surfaceSize / 8;

    const renderReachableHint = () => {
      if (this.props.canBeReached) {
        return <View style={{
          width: '90%',
          height: '90%',
          borderColor: this.props.myTurn ? 'black' : 'white',
          borderWidth: 2,
          borderStyle: 'dotted'
        }}></View>
      }
    };
    
    const onClick = this.props.onClick.bind(null, this.props.playerID, this.props.opponentID, this.props.currentGame);
    
    return <TouchableOpacity activeOpacity={0.5} onPress={onClick}>
      <View style={{
        backgroundColor: getColor(this.props.color),
        width: fieldSize,
        height: fieldSize,
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {renderReachableHint()}
      </View>
    </TouchableOpacity>;
  }
}

Field.propTypes = {
  color: React.PropTypes.number,
  x: React.PropTypes.number,
  y: React.PropTypes.number,
  onClick: React.PropTypes.func
};