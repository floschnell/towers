import React from 'react';
import {
    StyleSheet,
    Text,
    View
} from 'react-native';
import BoardContainer from '../../Board/BoardContainer';
import TowerSetContainer from '../../TowerSet/TowerSetContainer';

export default class Game extends React.Component {
  
  render() {
    const size = this.props.width < this.props.height ? this.props.width : this.props.height;
    const marginTop = (this.props.height - size) / 2;
    const marginLeft = (this.props.width - size) / 2;
    
    console.log('uids: ', this.props.playerUIDs);
    console.log('position: ', this.props.towerPositions);

    const playerOneTowers = this.props.towerPositions[this.props.playerUIDs[0]];
    const playerTwoTowers = this.props.towerPositions[this.props.playerUIDs[1]];

    return <View style={{marginTop, marginLeft}}>
      <BoardContainer size={size} />
      <TowerSetContainer towers={playerOneTowers} size={size} />
      <TowerSetContainer towers={playerTwoTowers} size={size} />
    </View>;
  }
}