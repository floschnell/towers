import React from 'react';
import css from './Tower.styl';

export default class Tower extends React.Component {
    render() {
        const tower = this.props.tower;
        const activeModifier = this.props.isActive ? 'active' : 'inactive';
        const classname = `tower color-${tower.color} tower--player${tower.belongsToPlayer} tower--${activeModifier}`;
        return <div className={classname}></div>;
    }
}

Tower.propTypes = {
  x: React.PropTypes.number,
  y: React.PropTypes.number,
  tower: React.PropTypes.object,
  isActive: React.PropTypes.bool
};