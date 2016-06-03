import React from 'react';
import css from './Tower.styl';

export default class Tower extends React.Component {
    render() {
        
        const tower = this.props.tower;
        
        const styles = {
            position: 'absolute',
            left: tower.x * 50,
            top: tower.y * 50
        };
        
        const onClick = event => {
            this.props.clickOnTower(tower, this.props.playerName);
        }
        
        const activeModifier = this.props.isActive ? 'active' : 'inactive';
        const classname = `tower color-${tower.color} tower--player${tower.belongsToPlayer} tower--${activeModifier}`;
        return <div className={classname} style={styles} onClick={onClick}></div>;
    }
}

Tower.propTypes = {
  x: React.PropTypes.number,
  y: React.PropTypes.number,
  tower: React.PropTypes.object,
  isActive: React.PropTypes.bool
};