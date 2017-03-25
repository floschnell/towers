import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { getColor } from '../../../utils';

export default class Field extends React.Component {
  render() {
    const classname = `field color-${this.props.color}`;
    
    const fieldSize = this.props.surfaceSize / 8;

    const styles = {
      backgroundColor: getColor(this.props.color),
      width: fieldSize,
      height: fieldSize
    };
    
    const onClick = this.props.onClick.bind(null, this.props.playerID, this.props.opponentID, this.props.currentGame);
    
    return <TouchableOpacity activeOpacity={0.5} onPress={onClick}><View style={styles}></View></TouchableOpacity>;
  }
}

Field.propTypes = {
  color: React.PropTypes.number,
  x: React.PropTypes.number,
  y: React.PropTypes.number,
  onClick: React.PropTypes.func
};