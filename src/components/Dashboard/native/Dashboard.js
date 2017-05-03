import React from 'react';
import {Text, View, Button, Keyboard, ScrollView} from 'react-native';
import {getOpponent} from '../../../gamelogic';
import Logger from '../../../logger';

/**
 * Native dashboard component.
 * This is where a new game can be started
 * or currently running games can be resumed.
 */
export default class Dashboard extends React.Component {
  /**
   * @override
   */
  componentWillMount() {
    Keyboard.dismiss();
    this.props.subscribeOnGameUpdates(this.props.player.id);
  }

  /**
   * @override
   */
  componentWillUnmount() {
    this.props.unsubscribeFromGameUpdates(this.props.player.id);
  }

  /**
   * @override
   */
  render() {
    const renderGames = () =>
      Object.keys(this.props.games).map((gameKey) => {
        Logger.debug('games:', this.props.games);
        const game = this.props.games[gameKey];
        const playerIDs = Object.keys(game.players);
        const playerID = this.props.player.id;
        const opponentID = getOpponent(playerID, playerIDs);
        const opponentName = game.players[opponentID].name;
        const chooseGame = () => {
          if (!this.props.isLoading) {
            this.props.chooseGame(gameKey);
          }
        };
        const myTurn = game.currentPlayer === playerID;
        const turnDesc = myTurn ? '(your turn)' : '(waiting)';

        return (
          <View
            key={gameKey + '-view'}
            style={{paddingHorizontal: 15, paddingVertical: 5}}
          >
            <Button
              key={`button-${gameKey}`}
              onPress={chooseGame}
              title={`You vs. ${opponentName} ${turnDesc}`}
            />
          </View>
        );
      });

    const renderGamelist = () => {
      const thereAreAnyGames = Object.keys(this.props.games).length > 0;

      if (thereAreAnyGames) {
        return (
          <View style={{flex: 1}}>
            <Text style={{margin: 15, marginBottom: 5}}>
              These are your currently running Games:
            </Text>
            <ScrollView style={{flex: 1}}>
              {renderGames()}
            </ScrollView>
          </View>
        );
      } else {
        return (
          <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Text style={{margin: 5}}>
              You do not have any games currently, let's start one!
            </Text>
          </View>
        );
      }
    };

    return (
      <View style={{flex: 1}}>
        <View style={{margin: 5}}>
          <Button
            onPress={this.props.playTutorial.bind(null, this.props.player)}
            title="Play Tutorial"
            color="red"
          />
        </View>
        <View style={{margin: 5, marginTop: 0}}>
          <Button
            onPress={this.props.startNewGame}
            title="Start New Game"
            color="red"
          />
        </View>
        <View style={{margin: 5, marginTop: 0}}>
          <Button
            onPress={this.props.playAgainstPC.bind(null, this.props.player)}
            title="Play Against PC"
            color="red"
          />
        </View>
        {renderGamelist()}
      </View>
    );
  }
}

Dashboard.propTypes = {
  playAgainstPC: React.PropTypes.func.isRequired,
  startNewGame: React.PropTypes.func.isRequired,
  playTutorial: React.PropTypes.func.isRequired,
  chooseGame: React.PropTypes.func.isRequired,
  subscribeOnGameUpdates: React.PropTypes.func.isRequired,
  unsubscribeFromGameUpdates: React.PropTypes.func.isRequired,
  player: React.PropTypes.object,
  games: React.PropTypes.object,
  isLoading: React.PropTypes.bool,
};
