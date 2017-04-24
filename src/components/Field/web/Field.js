import React from 'react';
import css from './Field.styl';

export default class Field extends React.Component {
  render() {
    const classname = `field color-${this.props.color}`;
    
    const fieldSize = this.props.surfaceSize / 8;
    const styles = {
      width: fieldSize,
      height: fieldSize
    };
    
    const onClick = this.props.onClick.bind(null, this.props.playerID, this.props.opponentID, this.props.currentGame);
    
    return <div className={classname} onClick={onClick} style={styles}></div>;
  }
}

Field.propTypes = {
  color: React.PropTypes.number,
  x: React.PropTypes.number,
  y: React.PropTypes.number,
  onClick: React.PropTypes.func
};