import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import {getColor} from '../../../utils';

/**
 * Renders a game tower for the native game version.
 */
export default class Tower extends React.Component {
  /**
   * @override
   */
  render() {
    const tower = this.props.tower;
    const color = this.props.belongsToMe ? 'black' : 'white';

    const styles = {
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      margin: this.props.size * 0.2,
      left: this.props.x * this.props.size,
      top: this.props.y * this.props.size,
      width: this.props.size * 0.6,
      height: this.props.size * 0.6,
      backgroundColor: getColor(tower.color),
      borderColor: color,
    };
    const transforms = [];

    Object.assign(styles, {
      borderWidth: 6,
      borderStyle: 'solid',
    });

    const renderActiveMark = () => {
      if (this.props.isSelected) {
        return (
          <View
            style={{
              backgroundColor: color,
              width: '40%',
              height: '40%',
            }}
          />
        );
      } else {
        return null;
      }
    };

    styles.transform = transforms;

    const onClick = (event) => {
      if (this.props.belongsToMe) {
        this.props.clickOnTower(tower, this.props.playerID);
      }
    };

    return (
      <TouchableOpacity activeOpacity={0.5} onPress={onClick.bind(this)} style={styles}>
        {renderActiveMark()}
      </TouchableOpacity>
    );
  }
}

Tower.propTypes = {
  size: React.PropTypes.number,
  x: React.PropTypes.number,
  y: React.PropTypes.number,
  playerID: React.PropTypes.string,
  tower: React.PropTypes.object,
  isActive: React.PropTypes.bool,
  isSelected: React.PropTypes.bool,
  belongsToMe: React.PropTypes.bool,
  clickOnTower: React.PropTypes.func,
};
