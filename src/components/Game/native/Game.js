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
import { TUTORIAL_MESSAGE_POSITION } from '../../../tutorial';

export default class Game extends React.Component {

  componentWillUnmount() {
    this.props.suspendGame(this.props.game);
  }

  render() {
    const playerOneTowers = this.props.towerPositions[this.props.playerIDs[0]];
    const playerTwoTowers = this.props.towerPositions[this.props.playerIDs[1]];
    const gameHasEnded = this.props.won || this.props.lost;
    const endGame = () => {
      this.props.endGame(this.props.game, this.props.playerID);
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

    const renderPlayer = () => 
      <View style={{flexGrow: 1, backgroundColor: 'black', justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{ color: 'white', fontSize: 22 }}>{this.props.player.name}</Text>
        <Text style={{ color: 'white', fontSize: 14 }}>{this.props.myTurn ? 'about to move': 'is waiting ...'}</Text>
      </View>;

    const renderOpponent = () =>
      <View style={{flexGrow: 1, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{ color: 'black', fontSize: 22 }}>{this.props.opponent.name}</Text>
        <Text style={{ color: 'black', fontSize: 14 }}>{this.props.myTurn ? 'is waiting ...': 'about to move'}</Text>
      </View>;

    const visualizeLastMoves = () => this.props.lastMoves.map(move => {
      const sourceX = this.props.rotateBoard ? 7 - move.sourceField.x : move.sourceField.x;
      const sourceY = this.props.rotateBoard ? 7 - move.sourceField.y : move.sourceField.y;
      const targetX = this.props.rotateBoard ? 7 - move.targetField.x : move.targetField.x;
      const targetY = this.props.rotateBoard ? 7 - move.targetField.y : move.targetField.y;

      return <Arrow
          key={`move-${move.sourceField.x}x${move.sourceField.y}y-${move.targetField.x}x${move.targetField.y}y`}
          fromX={sourceX * this.props.fieldSize + this.props.fieldSize / 2}
          fromY={sourceY * this.props.fieldSize + this.props.fieldSize / 2}
          toX={targetX * this.props.fieldSize + this.props.fieldSize / 2}
          toY={targetY * this.props.fieldSize + this.props.fieldSize / 2}
          width={10}
          color={this.props.lastMoveByMe ? 'black' : 'white'}
      />
    });

    const renderTutorialMessage = () => {
      console.debug('message pos', this.props.tutorialMessagePosition);
      const messageTop = this.props.tutorialMessagePosition === TUTORIAL_MESSAGE_POSITION.BOARD_EDGE ?
        this.props.marginSize / 2 + this.props.fieldSize + 10 :
        10;

      if (this.props.tutorialMessage) {
        return <View style={{position: 'absolute', borderRadius: 5, padding: 5, top: messageTop, left: 10, right: 10, backgroundColor: 'rgba(255, 255, 255, 0.9)'}}>
          <Text style={{color: 'black', paddingBottom: 5}}>{this.props.tutorialMessage}</Text>
          {this.props.tutorialContinueOnMessageClick ?
            <Button onPress={this.props.nextTutorialStep} title="Continue" color="blue"></Button> : null
          }
        </View>
      } else {
        return null;
      }
    };

    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'stretch' }}>
              {renderOpponent()}
              <View style={{width: this.props.size, height: this.props.size}}>
                  <BoardContainer size={this.props.size} reverse={this.props.rotateBoard} />
                  {visualizeLastMoves()}
                  <TowerSetContainer towers={playerOneTowers} size={this.props.size} reverse={this.props.rotateBoard} />
                  <TowerSetContainer towers={playerTwoTowers} size={this.props.size} reverse={this.props.rotateBoard} />
              </View>
              {renderPlayer()}
              {renderTutorialMessage()}
              {renderEndOfGame()}
          </View>;
  }
}