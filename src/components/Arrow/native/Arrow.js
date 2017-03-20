import React from 'react';
import {
    StyleSheet,
    View,
} from 'react-native';

export default class Arrow extends React.Component {

    constructor() {
        super();
    }

    render() {
        const rad = Math.atan2(this.props.fromY - this.props.toY, this.props.fromX - this.props.toX);
        const angle = 180 / Math.PI * rad;
        const distance = Math.sqrt(Math.pow(this.props.toX - this.props.fromX, 2) + Math.pow(this.props.toY - this.props.fromY, 2));
        const offsetY = Math.sin(rad) * distance / 2;
        const offsetX = (distance + Math.cos(rad) * distance) / 2;

        return <View style={{
            position: 'absolute',
            width: distance,
            height: this.props.width,
            opacity: 0.5,
            borderRadius: this.props.width / 2,
            backgroundColor: this.props.color,
            top:  this.props.fromY - offsetY - this.props.width / 2,
            left: this.props.fromX - offsetX,
            transform: [
                {
                    rotate: angle + 'deg'
                }
            ]
        }}></View>;
    }
};