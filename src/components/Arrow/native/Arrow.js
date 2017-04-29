const React = require('react');
import {View} from 'react-native';

/**
 * Represents a 2-dimensional arrow from one point to another.
 */
export default class Arrow extends React.Component {
  /**
   * @override
   */
  render() {
    const rad = Math.atan2(
      this.props.fromY - this.props.toY,
      this.props.fromX - this.props.toX
    );
    const angle = 180 / Math.PI * rad;
    const distance = Math.sqrt(
      Math.pow(this.props.toX - this.props.fromX, 2) +
        Math.pow(this.props.toY - this.props.fromY, 2)
    );
    const offsetY = Math.sin(rad) * distance / 2;
    const offsetX = (distance + Math.cos(rad) * distance) / 2;

    return (
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          width: distance,
          height: this.props.width,
          opacity: 0.5,
          borderRadius: this.props.width / 2,
          backgroundColor: this.props.color,
          top: this.props.fromY - offsetY - this.props.width / 2,
          left: this.props.fromX - offsetX,
          transform: [
            {
              rotate: angle + 'deg',
            },
          ],
        }}
      />
    );
  }
}

Arrow.propTypes = {
  fromY: React.PropTypes.number.isRequired,
  fromX: React.PropTypes.number.isRequired,
  toY: React.PropTypes.number.isRequired,
  toX: React.PropTypes.number.isRequired,
  width: React.PropTypes.number.isRequired,
  color: React.PropTypes.number.isRequired,
};
