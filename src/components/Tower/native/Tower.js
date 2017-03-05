import React from 'react';
import { View } from 'react-native';

export default class Tower extends React.Component {

    render() {
        const tower = this.props.tower;
        const fieldSize = (this.props.surfaceSize / 8);

        const styles = {
            position: 'absolute',
            left: this.props.x * this.props.size + this.props.size * 0.2,
            top: this.props.y * this.props.size + this.props.size * 0.2,
            width: this.props.size * 0.6,
            height: this.props.size * 0.6,
            backgroundColor: this.getColor(tower.color),
            borderColor: 'grey', borderWidth: 1, borderStyle: 'solid'
        };

        const onClick = event => {
            this.props.clickOnTower(tower, this.props.playerUid);
        }

        return <View style={styles} onPress={onClick.bind(this)}></View>
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