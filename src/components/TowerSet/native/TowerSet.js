import React from 'react';
import {View} from 'react-native';
import TowerContainer from '../../Tower/TowerContainer';

/**
 * Renders a set of towers for the native game version.
 */
export default class TowerSet extends React.Component {
  /**
   * @override
   */
  render() {
    const towers = this.props.towers.map((tower) => {
      const fieldSize = this.props.size / 8;

      return (
        <TowerContainer
          key={`${tower.belongsToPlayer}-${tower.color}`}
          tower={tower}
          x={this.props.reverse ? 7 - tower.x : tower.x}
          y={this.props.reverse ? 7 - tower.y : tower.y}
          size={fieldSize}
        />
      );
    });

    return (
      <View
        style={{
          top: 0,
          left: 0,
          position: 'absolute',
          width: this.props.size,
          height: this.props.size,
        }}
      >
        {towers}
      </View>
    );
  }
}

TowerSet.propTypes = {
  size: React.PropTypes.number,
  reverse: React.PropTypes.bool,
  towers: React.PropTypes.array,
};
