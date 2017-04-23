import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    Button,
    Keyboard,
    ScrollView,
    ActivityIndicator
} from 'react-native';

export default class CreateGame extends React.Component {

    constructor() {
        super();
        this.state = {
            searchStr: ''
        };
    }
  
    render() {
        const renderPlayers = () => {
            return Object.keys(this.props.players).map(opponentID => {
                const playerID = this.props.player.id;
                const player = this.props.player;
                const opponent = this.props.players[opponentID];
                const startGameOnClick = () => {
                    this.props.startGame(playerID, opponentID, {
                        [playerID]: player,
                        [opponentID]: opponent
                    });
                };

                if (playerID !== opponentID) {
                    return <View key={`${opponentID}-view`} style={{margin: 5}}>
                        <Button key={opponentID} title={opponent.name} onPress={startGameOnClick} ></Button>
                    </View>;
                }
            })
        };

        const searchPlayers = () => {
            this.props.updatePlayerResults(this.state.searchStr);
        };

        return <View style={{flex: 1, flexDirection: 'column'}}>
                <View style={{flexGrow: 0, alignItems: 'center', flexDirection: 'row'}}>
                    <Text style={{padding: 5, paddingLeft: 10}}>Search for Opponent: </Text>
                    <TextInput style={{flexGrow: 1}}
                            onChangeText={searchStr => {
                                this.setState({searchStr});
                                this.props.searchForPlayers(searchStr);
                            }}
                            value={this.state.searchStr}
                        />
                </View>
                <ScrollView style={{ flexGrow: 1 }}>
                    {renderPlayers()}
                </ScrollView>
        </View>;
    }
}