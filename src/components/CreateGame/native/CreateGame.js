import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    Button,
    Keyboard,
    ScrollView
} from 'react-native';
import {Actions} from 'react-native-router-flux';

export default class CreateGame extends React.Component {

    constructor() {
        super();
        this.state = {
            searchStr: ''
        };
    }
  
    render() {

        const renderPlayers = () => {
            return Object.keys(this.props.players).map(uid => {
                const opponent = this.props.players[uid];

                const startGame = () => {
                    this.props.startGame(this.props.player.uid, uid);
                    console.log('ok');
                    Actions.pop();
                    console.log('ok2');
                    Actions.game({title: this.props.player.name + ' vs ' + opponent.name});
                };

                return <View key={`${uid}-view`} style={{margin: 5}}>
                    <Button key={uid} title={opponent.name} onPress={startGame} ></Button>
                </View>;
            })
        };

        const searchPlayers = () => {
            this.props.updatePlayerResults(this.state.searchStr);
        };

        return <View style={{flex: 1}}>
            <TextInput
                    onChangeText={searchStr => {
                        this.setState({searchStr});
                        searchPlayers();
                    }}
                    value={this.state.searchStr}
                />
                <ScrollView style={{ flex: 1, marginTop: 5 }}>
                    {renderPlayers()}
                </ScrollView>
        </View>;
    }
}