import React from 'react';
import './Field.styl';

/**
 * Web component for a field of the board game.
 */
export default class Field extends React.Component {
  /**
   * @override
   */
  render() {
    const classname = `field color-${this.props.color}`;

    const fieldSize = this.props.surfaceSize / 8;
    const styles = {
      width: fieldSize,
      height: fieldSize,
    };

    const onClick = this.props.onClick.bind(
      null,
      this.props.playerID,
      this.props.opponentID,
      this.props.currentGame
    );

    return <div className={classname} onClick={onClick} style={styles} />;
  }
}

Field.propTypes = {
  color: React.PropTypes.number,
  onClick: React.PropTypes.func,
  playerID: React.PropTypes.string,
  opponentID: React.PropTypes.string,
  currentGame: React.PropTypes.string,
  myTurn: React.PropTypes.bool,
  canBeReached: React.PropTypes.bool,
  surfaceSize: React.PropTypes.number,
};
