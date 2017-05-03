import React from 'react';
import tower from '../../../../resources/tower.svg';
import towerActive from '../../../../resources/tower_active.svg';
import InlineSVG from 'svg-inline-react';

import './PlayerPlate.styl';

const towerElement = <InlineSVG src={tower} />;
const towerActiveElement = <InlineSVG src={towerActive} />;

/**
 * Renders information about a certain player.
 */
export default class PlayerPlate extends React.Component {
  /**
   * @override
   */
  render() {
    const className = `player-plate__icon player-plate__icon--player${this.props.isThisPlayer ? 1 : 2}`; // eslint-disable-line

    return (
      <div className="player-plate">
        <div className={className}>
          {this.props.isCurrentPlayer ? towerActiveElement : towerElement}
        </div>
        {this.props.name}
      </div>
    );
  }
}

PlayerPlate.propTypes = {
  isCurrentPlayer: React.PropTypes.bool,
  isThisPlayer: React.PropTypes.bool,
  name: React.PropTypes.string,
};
