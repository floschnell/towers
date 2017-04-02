import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    Button,
    ActivityIndicator
} from 'react-native';

export default class NavigationBar extends React.Component {

    constructor() {
        super();
    }

    renderLeftButton() {
        if (this.props.leftButtonTitle) {
            return <View style={{flexGrow: 1, justifyContent: 'center', alignItems: 'flex-start'}}>
                <Text onPress={this.props.onLeftButtonPress} style={{
                    color: this.props.leftButtonColor,
                    fontSize: 17
                }}>
                    {this.props.leftButtonTitle}
                </Text>
            </View>;
        } else {
            return <View style={{flexGrow: 1}}></View>;
        }
    }

    renderRightButton() {
        if (this.props.rightButtonTitle) {
            return <View style={{flexGrow: 1, justifyContent: 'center', alignItems: 'flex-end'}}>
                <Text style={{
                    color: this.props.rightButtonColor,
                    fontSize: 17
                }}>
                    {this.props.rightButtonTitle}
                </Text>
            </View>
        } else {
            return <View style={{flexGrow: 1}}></View>;
        }
    }

    render() {
        return <View>
            <View style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 44,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: this.props.backgroundColor
                }}>
                <View><Text style={{
                    color: this.props.titleColor,
                    fontSize: 20
                }}>{this.props.title}</Text></View>
            </View>
            <View style={{
                    height: 44,
                    alignItems: 'stretch',
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    paddingLeft: 10,
                    paddingRight: 10
                }}>
                    {this.renderLeftButton()}
                    {this.renderRightButton()}    
            </View>
        </View>;
    }
};