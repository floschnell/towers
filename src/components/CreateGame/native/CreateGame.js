import React from 'react';
import {Text, View, TextInput, Button, ScrollView} from 'react-native';
import PropTypes from 'prop-types';

/**
 * Native view to create a new game.
 */
export default class CreateGame extends React.Component {
  /**
   * Initializes a new CreateGame component.
   */
  constructor() {
    super();
    this.state = {
      searchStr: '',
    };
  }

  /**
   * @override
   */
  render() {
    const renderPlayers = () => {
      return Object.keys(this.props.players).map((opponentID) => {
        const playerID = this.props.player.id;
        const player = this.props.player;
        const opponent = this.props.players[opponentID];
        const startGameOnClick = () => {
          this.props.startGame(playerID, opponentID, {
            [playerID]: player,
            [opponentID]: opponent,
          });
        };

        if (playerID !== opponentID) {
          return (
            <View key={`${opponentID}-view`} style={{margin: 5}}>
              <Button
                key={opponentID}
                title={opponent.name}
                onPress={startGameOnClick}
              />
            </View>
          );
        }
      });
    };

    return (
      <View style={{flex: 1, flexDirection: 'column'}}>
        <View style={{flexGrow: 0, alignItems: 'center', flexDirection: 'row'}}>
          <Text style={{padding: 5, paddingLeft: 10}}>Search for Opponent: </Text>
          <TextInput
            style={{flexGrow: 1}}
            onChangeText={(searchStr) => {
              this.setState({searchStr});
              this.props.searchForPlayers(searchStr);
            }}
            value={this.state.searchStr}
          />
        </View>
        <ScrollView style={{flexGrow: 1}}>
          {renderPlayers()}
        </ScrollView>
      </View>
    );
  }
}

CreateGame.propTypes = {
  player: PropTypes.object,
  players: PropTypes.object,
  startGame: PropTypes.func.isRequired,
  searchForPlayers: PropTypes.func.isRequired,
};
