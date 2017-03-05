import React from 'react';
import { View } from 'react-native';
import TowerContainer from '../../Tower/TowerContainer';

export default class TowerSet extends React.Component {
    
    render() {
        
        const towers = this.props.towers.map(tower => {
            const fieldSize = this.props.size / 8;

            return <TowerContainer key={`${tower.belongsToPlayer}-${tower.color}`} tower={tower} x={tower.x} y={tower.y} size={fieldSize} />;
        });
        
        return <View style={{ top: 0, left: 0, position: 'absolute', width: this.props.size, height: this.props.size }}>{towers}</View>;
    }
}