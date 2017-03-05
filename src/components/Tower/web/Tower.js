import React from 'react';
import css from './Tower.styl';
import towerPlayer2 from '../../../graphics/tower.svg';
import towerPlayer2Active from '../../../graphics/tower_active.svg';
import InlineSVG from 'svg-inline-react';

const towerElementPlayer2 = <InlineSVG src={towerPlayer2} />;
const towerElementPlayer2Active = <InlineSVG src={towerPlayer2Active} />;

export default class Tower extends React.Component {
    render() {
        
        const tower = this.props.tower;
        const fieldSize = (this.props.surfaceSize / 8);
        
        const styles = {
            position: 'absolute',
            left: tower.x * fieldSize,
            top: tower.y * fieldSize,
            width: fieldSize,
            height: fieldSize
        };
        
        const onClick = event => {
            this.props.clickOnTower(tower, this.props.playerUid);
        }
        
        const activeModifier = this.props.isActive ? 'tower--active' : 'tower--inactive';
        const selectedModifier = this.props.isSelected ? 'tower--selected' : '';
        const classname = `tower tower--color-${tower.color} tower--player${this.props.belongsToMe ? 1 : 2} ${activeModifier} ${selectedModifier}`;
        if (this.props.isActive) {
            return <div className={classname} style={styles} onClick={onClick}>{towerElementPlayer2Active}</div>;
        } else {
            return <div className={classname} style={styles} onClick={onClick}>{towerElementPlayer2}</div>;
        }
    }
}

Tower.propTypes = {
  x: React.PropTypes.number,
  y: React.PropTypes.number,
  tower: React.PropTypes.object,
  isActive: React.PropTypes.bool
};