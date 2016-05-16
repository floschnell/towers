import React from 'react';

export default class Tower extends React.Component {
    render() {
        const classname = `tower color-${this.props.color}`;
        return <div className={classname}></div>;
    }
}

Tower.propTypes = {
  x: React.PropTypes.number,
  y: React.PropTypes.number,
  color: React.PropTypes.number
}