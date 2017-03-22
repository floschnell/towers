import React from 'react';
import { View, TouchableWithoutFeedback } from 'react-native';

export default class Tower extends React.Component {

    render() {
        const tower = this.props.tower;
        const color = this.props.belongsToMe ? 'black' : 'white';

        const styles = {
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            left: this.props.x * this.props.size + this.props.size * 0.2,
            top: this.props.y * this.props.size + this.props.size * 0.2,
            width: this.props.size * 0.6,
            height: this.props.size * 0.6,
            backgroundColor: this.getColor(tower.color),
            borderColor: color
        };
        const transforms = [];


        Object.assign(styles, {
            borderWidth: 6,
            borderStyle: 'solid'
        });

        const renderActiveMark = () => {
            if (this.props.isSelected) {
                return <View style={{
                    backgroundColor: color,
                    width: '40%',
                    height: '40%'
                }} />
            } else {
                return null;
            }
        }

        styles.transform = transforms;

        const onClick = event => {
            this.props.clickOnTower(tower, this.props.playerID);
        }

        return <TouchableWithoutFeedback onPress={onClick.bind(this)}>
            <View style={styles}>
                {renderActiveMark()}
            </View>
        </TouchableWithoutFeedback>
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