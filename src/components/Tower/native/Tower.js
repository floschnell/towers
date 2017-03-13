import React from 'react';
import { View, TouchableWithoutFeedback } from 'react-native';

export default class Tower extends React.Component {

    render() {
        const tower = this.props.tower;

        const styles = {
            position: 'absolute',
            left: this.props.x * this.props.size + this.props.size * 0.2,
            top: this.props.y * this.props.size + this.props.size * 0.2,
            width: this.props.size * 0.6,
            height: this.props.size * 0.6,
            backgroundColor: this.getColor(tower.color),
        };
        
        Object.assign(styles, this.props.isActive ? {
            borderColor: 'black',
            borderWidth: 4,
            borderStyle: 'solid'
        } : {
            borderColor: 'grey',
            borderWidth: 2,
            borderStyle: 'solid'
        });

        Object.assign(styles, !this.props.belongsToMe ? {
            transform: [{ rotate: '45deg'}]
        }: {});

        const onClick = event => {
            this.props.clickOnTower(tower, this.props.playerUid);
        }

        return <TouchableWithoutFeedback onPress={onClick.bind(this)}><View style={styles}></View></TouchableWithoutFeedback>
    }

    getColor(colorCode) {
        const colors = [
            'orange',
            'blue',
            'purple',
            'pink',
            'yellow',
            'red',
            'green',
            'brown'
        ];
        return colors[colorCode];
    }
}

Tower.propTypes = {
    x: React.PropTypes.number,
    y: React.PropTypes.number,
    tower: React.PropTypes.object,
    isActive: React.PropTypes.bool
};