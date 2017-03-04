import React from 'react';
import css from './PlayerPlate.styl';
import { hashHistory } from 'react-router';
import towerPlayer1 from '../../../graphics/tower_player1.svg';
import towerPlayer2 from '../../../graphics/tower_player2.svg';
import InlineSVG from 'svg-inline-react';

const towerElementPlayer1 = <div className="player-plate__icon"><InlineSVG src={towerPlayer1} /></div>;
const towerElementPlayer2 = <div className="player-plate__icon"><InlineSVG src={towerPlayer2} /></div>;

export default class PlayerPlate extends React.Component {
  render() {
    const styles = {
        position: 'absolute',
        top: this.props.height / 2
    };
    const playerIcon = this.props.name === 0 ? towerElementPlayer1 : towerElementPlayer2;

    return <div className="player-plate" style={styles}>
        {playerIcon}{this.props.name}
    </div>;
  }
};