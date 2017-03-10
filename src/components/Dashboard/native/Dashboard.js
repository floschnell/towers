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
import firebase from 'firebase';
import { getOpponent } from '../../../gamelogic';
import {Actions} from 'react-native-router-flux'

export default class Login extends React.Component {

    constructor() {
        super();
        this.updateHandler = null;
    }

    componentWillMount() {
        Keyboard.dismiss();
        this.props.subscribeOnGameUpdates(this.props.player.uid);
    }

    componentWillUnmount() {
        this.props.unsubscribeFromGameUpdates();
    }

    render() {
        const styles = StyleSheet.create({
            container: {
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#F5FCFF',
            },
            fieldContainer: {
                margin: 5,
                flexDirection: 'row',
                alignItems: 'center'
            },
            inputField: {
                height: 40,
                width: 150
            }
        });

        const renderGames = () => Object.keys(this.props.games).map(key => {
            console.log('games:', this.props.games);
            const game = this.props.games[key];
            const playerUIDs = Object.keys(game.players);
            const playerUID = this.props.player.uid;
            const opponentUID = getOpponent(playerUID, playerUIDs);
            const playerName = game.players[playerUID].name;
            const opponentName = game.players[opponentUID].name;
            const chooseGame = () => {
                if (!this.props.isLoading) {
                    this.props.chooseGame(key, game).then(() => {
                        Actions.game({title: `${playerName} vs ${opponentName}`});
                    });
                }
            }
            const myTurn = game.currentPlayer === playerUID;
            const turnDesc = myTurn ? '(your turn)' : '(waiting)';

            return <View key={key+'-view'} style={{ paddingHorizontal: 15, paddingVertical: 5 }}><Button key={key} onPress={chooseGame} title={`You vs. ${opponentName} ${turnDesc}`}></Button></View>
        });

        const gamesList = Object.keys(this.props.games).length > 0 ?
            <View style={{flex: 1}} >
                <Text style={{ margin: 15, marginBottom: 5 }}>These are your currently running Games:</Text>
                <ScrollView style={{ flex: 1 }}>
                    {renderGames()}
                </ScrollView>
            </View> :
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><Text style={{ margin: 5 }}>You do not have any games currently, let's start one!</Text></View>;

        const createActivityIndicator = () => {
            if (this.props.isLoading) {
                return <View style={{zIndex: 2, flex: 1, alignItems: 'center', justifyContent: 'center', position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, backgroundColor: 'white', opacity: 0.5}}>
                    <ActivityIndicator size={50} />
                </View>;
            } else {
                return null;
            }
        }

        return <View style={{ flex: 1 }}>
            <View style={{ zIndex:1, padding: 5 }}>
                <Button onPress={() => Actions.createGame()} title="Start New Game" color="red" ></Button>
            </View>
            {gamesList}
            {createActivityIndicator()}
        </View>;
    }
};