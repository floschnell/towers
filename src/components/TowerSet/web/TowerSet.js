import React from 'react';
import TowerContainer from '../../Tower/TowerContainer';

export default class TowerSet extends React.Component {
    
    render() {
        const towers = this.props.towers.map(tower => {
            const fieldSize = this.props.size / 8;

            return <TowerContainer key={`${tower.belongsToPlayer}-${tower.color}`} tower={tower} x={tower.x} y={tower.y} size={fieldSize} />;
        });

        return <div>{towers}</div>;
    }
}