import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    Button
} from 'react-native';
import firebase from 'firebase';
import { getOpponent } from '../../../gamelogic';

export default class Login extends React.Component {

    constructor() {
        super();
        this.updateHandler = null;
    }

    componentWillMount() {
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

        const renderGames = () => {
            return Object.keys(this.props.games).map(key => {
                const chooseGame = this.props.chooseGame.bind(null, key);
                const game = this.props.games[key];
                const playerUID = this.props.player.uid;
                const opponentUID = getOpponent(playerUID, Object.keys(game.players));
                const opponentName = game.players[opponentUID].name;
                const myTurn = game.currentPlayer === playerUID;

                return <Text key={key} onPress={chooseGame}>
                    {myTurn ? `It is your turn in the game against ${opponentName}!` : `Waiting for ${opponentName} to take his turn ...`}
                </Text>;
            });
        };

        return <View style={styles.container}>
            <Text>These are your currently running games:</Text>
            {renderGames()}
        </View>;
    }
};