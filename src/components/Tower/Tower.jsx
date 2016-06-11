import React from 'react';
import css from './Tower.styl';

export default class Tower extends React.Component {
    render() {
        
        const tower = this.props.tower;
        const fieldSize = (this.props.surfaceSize / 8);
        
        const styles = {
            position: 'absolute',
            left: tower.x * fieldSize,
            top: tower.y * fieldSize,
            width: fieldSize - 10,
            height: fieldSize - 10
        };
        
        const onClick = event => {
            this.props.clickOnTower(tower, this.props.playerName);
        }
        
        const activeModifier = this.props.isActive ? 'tower--active' : 'tower--inactive';
        const selectedModifier = this.props.isSelected ? 'tower--selected' : '';
        const classname = `tower color-${tower.color} tower--player${tower.belongsToPlayer} ${activeModifier} ${selectedModifier}`;
        return <div className={classname} style={styles} onClick={onClick}></div>;
    }
}

Tower.propTypes = {
  x: React.PropTypes.number,
  y: React.PropTypes.number,
  tower: React.PropTypes.object,
  isActive: React.PropTypes.bool
};