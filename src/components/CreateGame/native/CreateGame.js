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
import {Actions, ActionConst} from 'react-native-router-flux';

export default class CreateGame extends React.Component {

    constructor() {
        super();
        this.state = {
            searchStr: ''
        };
    }
  
    render() {
        const renderPlayers = () => {
            return Object.keys(this.props.players).map(opponentUID => {
                const playerUID = this.props.player.uid;
                const player = this.props.player;
                const opponent = this.props.players[opponentUID];
                const startGameOnClick = () => {
                    this.props.startGame(playerUID, opponentUID, {
                        [playerUID]: player,
                        [opponentUID]: opponent
                    });
                };

                return <View key={`${opponentUID}-view`} style={{margin: 5}}>
                    <Button key={opponentUID} title={opponent.name} onPress={startGameOnClick} ></Button>
                </View>;
            })
        };

        const searchPlayers = () => {
            this.props.updatePlayerResults(this.state.searchStr);
        };

        return <View style={{flex: 1, flexDirection: 'column'}}>
            <View style={{zIndex: 1, flexGrow: 0, alignItems: 'center', alignSelf: 'stretch', flexDirection: 'row'}}>
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