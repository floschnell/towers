import React from 'react';
import { hashHistory } from 'react-router';

export default class PlayerPlate extends React.Component {
  render() {
    const styles = {
        position: 'absolute',
        left: this.props.left,
        top: this.props.top
    };
    return <div class="player-plate" style={styles}>
        {this.props.name}
    </div>;
  }
};