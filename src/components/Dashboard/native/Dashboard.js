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
import Logger from '../../../logger';

export default class Login extends React.Component {

    constructor() {
        super();
    }

    componentWillMount() {
        Keyboard.dismiss();
        this.props.subscribeOnGameUpdates(this.props.player.id);
    }

    componentWillUnmount() {
        this.props.unsubscribeFromGameUpdates(this.props.player.id);
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

        const renderGames = () => Object.keys(this.props.games).map(gameKey => {
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

            return <View key={gameKey+'-view'} style={{ paddingHorizontal: 15, paddingVertical: 5 }}><Button key={`button-${gameKey}`} onPress={chooseGame} title={`You vs. ${opponentName} ${turnDesc}`}></Button></View>
        });

        const renderGamelist = () => {
            const thereAreAnyGames = Object.keys(this.props.games).length > 0;

            if (thereAreAnyGames) {
                return <View style={{flex: 1}} >
                    <Text style={{ margin: 15, marginBottom: 5 }}>These are your currently running Games:</Text>
                    <ScrollView style={{ flex: 1 }}>
                        {renderGames()}
                    </ScrollView>
                </View>;
            } else {
                return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ margin: 5 }}>You do not have any games currently, let's start one!</Text>
                </View>;
            }
        }

        return <View style={{ flex: 1 }}>
            <View style={{ margin: 5 }}>
                <Button onPress={this.props.playTutorial.bind(null, this.props.player)} title="Play Tutorial" color="red" ></Button>
            </View>
            <View style={{ margin: 5, marginTop: 0 }}>
                <Button onPress={this.props.startNewGame} title="Start New Game" color="red" ></Button>
            </View>
            <View style={{ margin: 5, marginTop: 0 }}>
                <Button onPress={this.props.playAgainstPC.bind(null, this.props.player)} title="Play Against PC" color="red" ></Button>
            </View>
            {renderGamelist()}
        </View>;
    }
};