import React from 'react';
import css from './Field.styl';

export default class Field extends React.Component {
  render() {
    const classname = `field color-${this.props.color}`;
    
    const fieldSize = this.props.surfaceSize / 8;
    const styles = {
      position: 'absolute',
      left: this.props.x * fieldSize,
      top: this.props.y * fieldSize,
      width: fieldSize,
      height: fieldSize
    };
    
    const onClick = this.props.onClick.bind(null, this.props.playerUid, this.props.opponentUid, this.props.currentGame);
    
    return <div className={classname} onClick={onClick} style={styles}></div>;
  }
}

Field.propTypes = {
  color: React.PropTypes.number,
  x: React.PropTypes.number,
  y: React.PropTypes.number,
  onClick: React.PropTypes.func
};