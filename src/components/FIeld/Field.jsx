import React from 'react';
import css from './Field.styl';

export default class Field extends React.Component {
  render() {
    const classname = `field color-${this.props.color}`;
    
    const styles = {
      position: 'absolute',
      left: this.props.x * 50,
      top: this.props.y * 50
    };
    
    const onClick = this.props.onClick.bind(null, this.props.playerName, this.props.currentGame);
    
    return <div className={classname} onClick={onClick} style={styles}></div>;
  }
}

Field.propTypes = {
  color: React.PropTypes.number,
  x: React.PropTypes.number,
  y: React.PropTypes.number,
  onClick: React.PropTypes.func
};