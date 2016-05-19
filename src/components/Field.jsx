import React from 'react';
import TowerContainer from '../containers/TowerContainer';

export default class Field extends React.Component {
  render() {
    const classname = `field color-${this.props.color}`;
    let tower = ""; 
    if (this.props.tower) {
      tower = <TowerContainer x={this.props.x} y={this.props.y} tower={this.props.tower} />
    }
    return <div className={classname} onClick={this.props.onClick}>{tower}</div>;
  }
}

Field.propTypes = {
  color: React.PropTypes.number,
  x: React.PropTypes.number,
  y: React.PropTypes.number,
  onClick: React.PropTypes.func
}