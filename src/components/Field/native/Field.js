import React from 'react';
import { View } from 'react-native';

export default class Field extends React.Component {
  render() {
    const classname = `field color-${this.props.color}`;
    
    const fieldSize = this.props.surfaceSize / 8;

    const styles = {
      backgroundColor: this.getColor(this.props.color),
      width: fieldSize,
      height: fieldSize
    };
    
    const onClick = this.props.onClick.bind(null, this.props.playerUid, this.props.currentGame);
    
    return <View style={styles} onPress={onClick}></View>;
  }

  getColor(colorCode) {
    const colors = [
      'orange',
      'blue',
      'purple',
      'pink',
      'yellow',
      'red',
      'green',
      'brown'
    ];
    return colors[colorCode];
  }
}

Field.propTypes = {
  color: React.PropTypes.number,
  x: React.PropTypes.number,
  y: React.PropTypes.number,
  onClick: React.PropTypes.func
};