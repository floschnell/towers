import React from 'react';
import Tower from './Tower';

export default class Field extends React.Component {
  render() {
    const classname = `field color-${this.props.color}`;
    let tower = ""; 
    if (this.props.tower) {
      tower = <Tower x={this.props.x} y={this.props.y} color={this.props.tower.color} />
    }
    return <div className={classname} onClick={this.props.onClick}>{tower}</div>;
  }
}

Field.propTypes = {
  x: React.PropTypes.number,
  y: React.PropTypes.number,
  onClick: React.PropTypes.func
}