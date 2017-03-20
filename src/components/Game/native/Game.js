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
import Arrow from '../../Arrow/native/Arrow';

export default class Game extends React.Component {

  render() {
    const playerOneTowers = this.props.towerPositions[this.props.playerUIDs[0]];
    const playerTwoTowers = this.props.towerPositions[this.props.playerUIDs[1]];
    const gameHasEnded = this.props.won || this.props.lost;
    const endGame = () => {
      this.props.endGame(this.props.game, this.props.playerUID);
    };

    const renderEndOfGame = () => {
      if (gameHasEnded) {
        return <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'}}>
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: 'black', opacity: 0.6 }} />
        <View>
            {this.props.won ? <Text style={{padding:10, fontSize: 20, fontWeight: 'bold', color: 'white'}} >Congratulations, you won!</Text> : <Text style={{padding:10, fontSize: 20, fontWeight: 'bold', color: 'white'}}>Oh no, you lost.</Text>}
            <Button title="End Game" onPress={endGame} />
        </View></View>;
      } else {
        return null;
      }
    }

    const getTransform = () => {
      if (this.props.rotateBoard) {
        return {
          rotate: '180deg'
        };
      } else {
        return {
          rotate: '0deg'
        };
      }
    };

    const renderPlayer = () => 
      <View style={{flexGrow: 1, backgroundColor: 'black', justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{ color: 'white', fontSize: 22, textDecorationLine: this.props.myTurn ? 'underline': undefined }}>{this.props.player.name}</Text>
      </View>;

    const renderOpponent = () =>
      <View style={{flexGrow: 1, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{ color: 'black', fontSize: 22, textDecorationLine: !this.props.myTurn ? 'underline': undefined }}>{this.props.opponent.name}</Text>
      </View>;

    const visualizeLastMoves = () => this.props.lastMoves.map(move =>
      <Arrow
          key={`move-${move.sourceField.x}x${move.sourceField.y}y-${move.targetField.x}x${move.targetField.y}y`}
          fromX={move.sourceField.x * this.props.fieldSize + this.props.fieldSize / 2}
          fromY={move.sourceField.y * this.props.fieldSize + this.props.fieldSize / 2}
          toX={move.targetField.x * this.props.fieldSize + this.props.fieldSize / 2}
          toY={move.targetField.y * this.props.fieldSize + this.props.fieldSize / 2}
          width={10}
          color={this.props.lastMoveByMe ? 'black' : 'white'}
      />
    );

    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'stretch' }}>
    {renderOpponent()}
      <View style={{width: this.props.size, height: this.props.size, transform: [ getTransform() ]}}>
        <BoardContainer size={this.props.size} />
        {visualizeLastMoves()}
        <TowerSetContainer towers={playerOneTowers} size={this.props.size} />
        <TowerSetContainer towers={playerTwoTowers} size={this.props.size} />
        </View>
        {renderPlayer()}
        {renderEndOfGame()}
    </View>;
  }
}