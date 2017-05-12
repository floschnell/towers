import React from 'react';
import {View, TouchableOpacity, Animated} from 'react-native';
import {getColor} from '../../../utils';

let sequence = null;

/**
 * Renders a game tower for the native game version.
 */
export default class Tower extends React.Component {
  /**
   * @override
   */
  render() {
    console.log('render tower');
    const tower = this.props.tower;
    const color = this.props.belongsToMe ? 'black' : 'white';
    const bgStyles = {};

    const styles = {
      margin: this.props.size * 0.2,
      width: this.props.size * 0.6,
      height: this.props.size * 0.6,
      backgroundColor: getColor(tower.color),
      borderColor: color,
      elevation: 10,
      borderWidth: 6,
      borderStyle: 'solid',
      alignItems: 'center',
      justifyContent: 'center',
      alignContent: 'center',
    };

    if (!this.props.belongsToMe) {
      Object.assign(styles, {
        transform: [{rotate: '45deg'}],
      });
    }

    if (this.props.isSelected) {
      Object.assign(bgStyles, {
        margin: this.props.size * 0.1,
        backgroundColor: color,
        opacity: 0.4,
      });
    }

    const renderActiveMark = () => {
      if (this.props.isSelected) {
        return null;
        /* (
          <View
            style={{
              backgroundColor: color,
              width: '40%',
              height: '40%',
            }}
          />
        );*/
      } else {
        return null;
      }
    };

    const onClick = (event) => {
      if (this.props.belongsToMe) {
        this.props.clickOnTower(tower, this.props.playerID);
      }
    };

    return (
      <View
        style={{
          position: 'absolute',
          left: this.props.x * this.props.size,
          top: this.props.y * this.props.size,
          flex: 0,
          alignItems: 'center',
          justifyContent: 'center',
          alignContent: 'center',
        }}
      >
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={onClick.bind(this)}
          style={styles}
        >
          <View
            style={{
              width: this.props.size * 0.15,
              height: this.props.size * 0.15,
              backgroundColor: color,
              opacity: 1,
              elevation: 5,
              display: this.props.isSelected ? 'flex' : 'none',
            }}
          />
        </TouchableOpacity>
      </View>
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
