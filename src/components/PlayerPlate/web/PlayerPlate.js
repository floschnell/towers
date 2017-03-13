import React from 'react';
import css from './PlayerPlate.styl';
import { hashHistory } from 'react-router';
import tower from '../../../../resources/tower.svg';
import towerActive from '../../../../resources/tower_active.svg';
import InlineSVG from 'svg-inline-react';

const towerElement = <InlineSVG src={tower} />;
const towerActiveElement = <InlineSVG src={towerActive} />;

export default class PlayerPlate extends React.Component {
  render() {
    const className = `player-plate__icon player-plate__icon--player${this.props.isThisPlayer ? 1 : 2}`;

    return <div className="player-plate" >
            <div className={className}>{this.props.isCurrentPlayer ? towerActiveElement : towerElement}</div>{this.props.name}
          </div>;
  }
};