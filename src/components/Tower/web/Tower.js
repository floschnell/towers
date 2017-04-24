import React from 'react';
import css from './Tower.styl';
import towerPlayer2 from '../../../../resources/tower.svg';
import towerPlayer2Active from '../../../../resources/tower_active.svg';
import InlineSVG from 'svg-inline-react';

const towerElementPlayer2 = <InlineSVG src={towerPlayer2} />;
const towerElementPlayer2Active = <InlineSVG src={towerPlayer2Active} />;

export default class Tower extends React.Component {
    render() {
        const tower = this.props.tower;
        
        const styles = {
            position: 'absolute',
            left: this.props.x * this.props.size,
            top: this.props.y * this.props.size,
            width: this.props.size,
            height: this.props.size
        };
        
        const onClick = event => {
            if (this.props.belongsToMe) {
                this.props.clickOnTower(tower, this.props.playerID);
            }
        }
        
        const activeModifier = this.props.isActive ? 'tower--active' : 'tower--inactive';
        const selectedModifier = this.props.isSelected ? 'tower--selected' : '';
        const classname = `tower tower--color-${tower.color} tower--player${this.props.belongsToMe ? 1 : 2} ${activeModifier} ${selectedModifier}`;
        if (this.props.isActive) {
            return <div className={classname} style={styles} onClick={onClick.bind(this)}>{towerElementPlayer2Active}</div>;
        } else {
            return <div className={classname} style={styles} onClick={onClick.bind(this)}>{towerElementPlayer2}</div>;
        }
    }
}
