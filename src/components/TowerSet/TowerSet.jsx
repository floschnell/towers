import React from 'react';
import TowerContainer from '../Tower/TowerContainer';

export default class TowerSet extends React.Component {
    
    render() {
        
        const towers = this.props.towers.map(tower =>
            <TowerContainer key={`${tower.belongsToPlayer}-${tower.color}`} player={tower.belongsToPlayer} color={tower.color} />
        );
        
        return <div>{towers}</div>;
    }
}