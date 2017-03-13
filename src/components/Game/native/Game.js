import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableWithoutFeedback,
    Button
} from 'react-native';
import BoardContainer from '../../Board/BoardContainer';
import TowerSetContainer from '../../TowerSet/TowerSetContainer';
import { Actions } from 'react-native-router-flux';

export default class Game extends React.Component {
  
  componentWillMount() {
    this.props.subscribeToUpdates(this.props.game);
  }

  componentWillUnmount() {
    this.props.unsubscribeFromUpdates(this.props.game);
  }

  render() {
    const size = this.props.width < this.props.height ? this.props.width : this.props.height;
    const playerOneTowers = this.props.towerPositions[this.props.playerUIDs[0]];
    const playerTwoTowers = this.props.towerPositions[this.props.playerUIDs[1]];
    const gameHasEnded = this.props.won || this.props.lost;
    const endGame = () => {
      this.props.endGame(this.props.game, this.props.playerUID);
    };

    const endOfGameMessage = <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          {this.props.won ? <Text style={{padding:10, fontSize: 20, fontWeight: 'bold', color: 'white'}} >Congratulations, you won!</Text> : <Text style={{padding:10, fontSize: 20, fontWeight: 'bold', color: 'white'}}>Oh no, you lost.</Text>}
          <Button title="End Game" onPress={endGame} />
      </View>;

    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <View style={{width: size, height: size}}>
        <BoardContainer size={size} />
        <TowerSetContainer towers={playerOneTowers} size={size} />
        <TowerSetContainer towers={playerTwoTowers} size={size} />
        </View>
        {gameHasEnded ? endOfGameMessage : null}
    </View>;
  }
}