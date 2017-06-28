import React from 'react';
import TowerContainer from '../../Tower/TowerContainer';
import PropTypes from 'prop-types';

/**
 * Renders a set of towers for the native web.
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
          x={tower.x}
          y={tower.y}
          size={fieldSize}
        />
      );
    });

    return <div>{towers}</div>;
  }
}

TowerSet.propTypes = {
  size: PropTypes.number,
  towers: PropTypes.array,
};
