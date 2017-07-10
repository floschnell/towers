import React from 'react';
import { Text, View, Button, AsyncStorage, Alert } from 'react-native';
import BoardContainer from '../../Board/BoardContainer';
import TowerSetContainer from '../../TowerSet/TowerSetContainer';
import Arrow from '../../Arrow/native/Arrow';
import { TUTORIAL_MESSAGE_POSITION } from '../../../tutorial';
import Logger from '../../../logger';
import PropTypes from 'prop-types';

/**
 * Renders the native view of a currently running game.
 */
export default class Game extends React.Component {
  /**
   * Creates a new instance of the game view.
   */
  constructor() {
    super();
    this.state = {
      tutorialMessageExpanded: true,
    };
  }

  /**
   * @override
   */
  componentWillUnmount() {
    this.props.suspendGame(this.props.game);
    this.setState({ tutorialMessageExpanded: true });

    if (this.props.inAIGame) {
      if (this.props.won || this.props.lost || this.props.moves.length === 0) {
        AsyncStorage.removeItem('savedGame');
      } else {
        const serializedGameState = JSON.stringify({
          moves: this.props.moves,
          currentPlayer: this.props.currentPlayer,
          currentColor: this.props.currentColor,
          players: {
            [this.props.player.id]: {
              name: this.props.player.name,
            },
            computer: {
              name: 'Computer',
            },
          },
        });

        Logger.info('saving game', serializedGameState);
        AsyncStorage.setItem('savedGame', serializedGameState);
      }
    }
  }

  /**
   * @override
   */
  componentDidMount() {
    if (this.props.inAIGame) {
      AsyncStorage.getItem('savedGame').then((serializedGameState) => {
        if (serializedGameState) {
          Alert.alert(
            'Resume Game',
            'A saved game has been found, do you want to continue playing?',
            [
              { text: 'Discard', onPress: () => { }, style: 'cancel' },
              {
                text: 'Resume',
                onPress: () => {
                  const gameState = JSON.parse(serializedGameState);

                  Logger.info('recovered game state', gameState);
                  this.props.updateGame(gameState);
                },
              },
            ],
            { cancelable: false }
          );
        }
      });
    }
  }

  /**
   * @override
   */
  componentWillReceiveProps(nextProps) {
    if (nextProps.tutorialMessage !== this.props.tutorialMessage) {
      this.setState({ tutorialMessageExpanded: true });
    }
  }

  /**
   * @override
   */
  render() {
    const fieldSize = this.props.size / 8;
    const playerOneTowers = this.props.towerPositionsForPlayer;
    const playerTwoTowers = this.props.towerPositionsForOpponent;
    const gameHasEnded = this.props.won || this.props.lost;
    const endGame = () => {
      this.props.endGame(this.props.game, this.props.player.id);
    };
    const endGameAndAskForRevenge = () => {
      this.props.endGameAndAskForRevenge(this.props.game, this.props.player.id, this.props.opponent.id, this.props.won);
    };

    const renderEndOfGame = () => {
      if (gameHasEnded) {
        return (
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              justifyContent: 'center',
              alignItems: 'center',
              elevation: 20,
            }}
          >
            <View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'black',
                opacity: 0.6,
              }}
            />
            <View>
              {this.props.won
                ? <Text
                  style={{
                    padding: 10,
                    fontSize: 20,
                    fontWeight: 'bold',
                    color: 'white',
                  }}
                >
                  Congratulations, you won!
                  </Text>
                : <Text
                  style={{
                    padding: 10,
                    fontSize: 20,
                    fontWeight: 'bold',
                    color: 'white',
                  }}
                >
                  Oh no, you lost.
                  </Text>}
              <Button title="End Game" onPress={endGame} />
              <View style={{ height: 10 }}></View>
              <Button title="Offer Revenge" onPress={endGameAndAskForRevenge} />
            </View>
          </View>
        );
      } else {
        return null;
      }
    };

    const renderText = (isOpponent) => {
      if (this.props.won) {
        return isOpponent ? 'Lost' : 'Won';
      } else if (this.props.lost) {
        return isOpponent ? 'Won' : 'Lost';
      } else {
        if (isOpponent) {
          return this.props.myTurn ? 'waiting for you ...' : 'is thinking ...';
        } else {
          return this.props.myTurn ? 'your turn!' : 'waiting ...';
        }
      }
    };

    const renderPlayer = () => (
      <View
        style={{
          flexGrow: 1,
          backgroundColor: 'black',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text style={{ color: 'white', fontSize: 22 }}>
          {this.props.player.name}
        </Text>
        <Text style={{ color: 'white', fontSize: 14 }}>
          {renderText(false)}
        </Text>
      </View>
    );

    const renderOpponent = () => (
      <View
        style={{
          flexGrow: 1,
          backgroundColor: 'white',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text style={{ color: 'black', fontSize: 22 }}>
          {this.props.opponent.name}
        </Text>
        <Text style={{ color: 'black', fontSize: 14 }}>
          {renderText(true)}
        </Text>
      </View>
    );

    const visualizeLastMoves = () =>
      this.props.lastMoves.map((move) => {
        const sourceX = this.props.rotateBoard
          ? 7 - move.sourceField.x
          : move.sourceField.x;
        const sourceY = this.props.rotateBoard
          ? 7 - move.sourceField.y
          : move.sourceField.y;
        const targetX = this.props.rotateBoard
          ? 7 - move.targetField.x
          : move.targetField.x;
        const targetY = this.props.rotateBoard
          ? 7 - move.targetField.y
          : move.targetField.y;

        return (
          <Arrow
            key={`arrow-${sourceX}.${sourceY}-${targetX}.${targetY}`}
            fromX={sourceX * fieldSize + fieldSize / 2}
            fromY={sourceY * fieldSize + fieldSize / 2}
            toX={targetX * fieldSize + fieldSize / 2}
            toY={targetY * fieldSize + fieldSize / 2}
            width={10}
            color={this.props.lastMoveByMe ? 'black' : 'white'}
          />
        );
      });

    const renderTutorialMessage = () => {
      Logger.debug('message pos', this.props.tutorialMessagePosition);
      const messageTop = this.props.tutorialMessagePosition ===
        TUTORIAL_MESSAGE_POSITION.BOARD_EDGE
        ? this.props.marginSize / 2 + fieldSize + 10
        : 10;

      const hideTutorialMessage = () => {
        this.setState({ tutorialMessageExpanded: false });
      };

      const showTutorialMessage = () => {
        this.setState({ tutorialMessageExpanded: true });
      };

      if (this.props.inTutorial && this.props.tutorialMessage) {
        if (this.state.tutorialMessageExpanded) {
          return (
            <View
              style={{
                position: 'absolute',
                borderRadius: 5,
                borderStyle: 'solid',
                borderColor: 'black',
                borderWidth: 1,
                padding: 5,
                top: messageTop,
                left: 10,
                right: 10,
                backgroundColor: 'white',
                opacity: 0.9,
                elevation: 15,
              }}
            >
              <Text style={{ color: 'black' }}>
                {this.props.tutorialMessage}
              </Text>
              {this.props.tutorialContinueOnMessageClick
                ? <View style={{ marginTop: 5 }}>
                  <Button
                    onPress={this.props.nextTutorialStep}
                    title="Continue"
                    color="red"
                  />
                </View>
                : null}
              <View style={{ marginTop: 5 }}>
                <Button
                  onPress={hideTutorialMessage.bind(this)}
                  title="Hide Message"
                  color="red"
                />
              </View>
            </View>
          );
        } else {
          return (
            <View
              style={{
                position: 'absolute',
                borderRadius: 5,
                borderStyle: 'solid',
                borderColor: 'black',
                borderWidth: 1,
                padding: 5,
                top: 5,
                left: 10,
                right: 10,
                height: this.props.marginSize / 2 - 10,
                backgroundColor: 'white',
              }}
            >
              <Text numberOfLines={1} style={{ color: 'black', padding: 5, flex: 1 }}>
                {this.props.tutorialMessage}
              </Text>
              <Button
                onPress={showTutorialMessage.bind(this)}
                title="Show Message"
                color="red"
              />
            </View>
          );
        }
      } else {
        return null;
      }
    };

    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'stretch' }}>
        {renderOpponent()}
        <View style={{ width: this.props.size, height: this.props.size }}>
          <BoardContainer size={this.props.size} reverse={this.props.rotateBoard} />
          {visualizeLastMoves()}
          <TowerSetContainer
            towers={playerOneTowers}
            size={this.props.size}
            reverse={this.props.rotateBoard}
          />
          <TowerSetContainer
            towers={playerTwoTowers}
            size={this.props.size}
            reverse={this.props.rotateBoard}
          />
        </View>
        {renderPlayer()}
        {renderTutorialMessage()}
        {renderEndOfGame()}
      </View>
    );
  }
}

Game.propTypes = {
  playerIDs: PropTypes.arrayOf(PropTypes.string),
  suspendGame: PropTypes.func,
  endGame: PropTypes.func,
  game: PropTypes.string,
  surfaceWidth: PropTypes.number,
  surfaceHeight: PropTypes.number,
  resizeGameSurface: PropTypes.func,
  goToDashboard: PropTypes.func,
  won: PropTypes.bool,
  myTurn: PropTypes.bool,
  lost: PropTypes.bool,
  rotateBoard: PropTypes.bool,
  lastMoveByMe: PropTypes.bool,
  inTutorial: PropTypes.bool,
  inAIGame: PropTypes.bool,
  player: PropTypes.object,
  opponent: PropTypes.object,
  towerPositionsForPlayer: PropTypes.array,
  towerPositionsForOpponent: PropTypes.array,
  lastMoves: PropTypes.array,
  tutorialMessage: PropTypes.string,
  tutorialMessagePosition: PropTypes.string,
  size: PropTypes.number,
  marginSize: PropTypes.number,
  nextTutorialStep: PropTypes.func,
  tutorialContinueOnMessageClick: PropTypes.bool,
  moves: PropTypes.array,
  currentPlayer: PropTypes.string,
  currentColor: PropTypes.number,
  updateGame: PropTypes.func,
  endGameAndAskForRevenge: PropTypes.func,
};
