import React from 'react';
import './Field.styl';
import PropTypes from 'prop-types';

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
  color: PropTypes.number,
  onClick: PropTypes.func,
  playerID: PropTypes.string,
  opponentID: PropTypes.string,
  currentGame: PropTypes.string,
  myTurn: PropTypes.bool,
  canBeReached: PropTypes.bool,
  surfaceSize: PropTypes.number,
};
