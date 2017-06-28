import React from 'react';
import {Text, View} from 'react-native';
import PropTypes from 'prop-types';

/**
 * Top navigation bar.
 * Helps the user to navigate and understand where he currently is located.
 */
export default class NavigationBar extends React.Component {
  /**
   * @override
   */
  render() {
    return (
      <View>
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 44,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: this.props.backgroundColor,
          }}
        >
          <View>
            <Text
              style={{
                color: this.props.titleColor,
                fontSize: 20,
              }}
            >
              {this.props.title}
            </Text>
          </View>
        </View>
        <View
          style={{
            height: 44,
            alignItems: 'stretch',
            justifyContent: 'space-between',
            flexDirection: 'row',
            paddingLeft: 10,
            paddingRight: 10,
          }}
        >
          {this.renderLeftButton()}
          {this.renderRightButton()}
        </View>
      </View>
    );
  }

  /**
   * Renders the left button of the navigation bar.
   *
   * @return {React.Component}
   */
  renderLeftButton() {
    if (this.props.leftButtonTitle) {
      return (
        <View
          style={{flexGrow: 1, justifyContent: 'center', alignItems: 'flex-start'}}
        >
          <Text
            onPress={this.props.onLeftButtonPress}
            style={{
              color: this.props.leftButtonColor,
              fontSize: 17,
            }}
          >
            {this.props.leftButtonTitle}
          </Text>
        </View>
      );
    } else {
      return <View style={{flexGrow: 1}} />;
    }
  }

  /**
   * Renders the left button of the navigation bar.
   *
   * @return {React.Component}
   */
  renderRightButton() {
    if (this.props.rightButtonTitle) {
      return (
        <View style={{flexGrow: 1, justifyContent: 'center', alignItems: 'flex-end'}}>
          <Text
            onPress={this.props.onRightButtonPress}
            style={{
              color: this.props.rightButtonColor,
              fontSize: 17,
            }}
          >
            {this.props.rightButtonTitle}
          </Text>
        </View>
      );
    } else {
      return <View style={{flexGrow: 1}} />;
    }
  }
}

NavigationBar.propTypes = {
  leftButtonTitle: PropTypes.string,
  rightButtonTitle: PropTypes.string,
  title: PropTypes.string,
  titleColor: PropTypes.string,
  backgroundColor: PropTypes.string,
  rightButtonColor: PropTypes.string,
  leftButtonColor: PropTypes.string,
  onLeftButtonPress: PropTypes.func,
  onRightButtonPress: PropTypes.func,
};
