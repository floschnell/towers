import React from 'react';
import css from './Tower.styl';
import towerPlayer1 from '../../../graphics/tower_player1.svg';
import towerPlayer2 from '../../../graphics/tower_player2.svg';
import InlineSVG from 'svg-inline-react';

const towerElementPlayer1 = <InlineSVG src={towerPlayer1} />;
const towerElementPlayer2 = <InlineSVG src={towerPlayer2} />;

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
        const classname = `tower tower--color-${tower.color} tower--player${tower.belongsToPlayer} ${activeModifier} ${selectedModifier}`;
        const towerElement = this.props.belongsToMe ? towerElementPlayer1 : towerElementPlayer2;

        return <div className={classname} style={styles} onClick={onClick}>{towerElement}</div>;
    }
}

Tower.propTypes = {
  x: React.PropTypes.number,
  y: React.PropTypes.number,
  tower: React.PropTypes.object,
  isActive: React.PropTypes.bool
};