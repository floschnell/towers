import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    Button,
    ActivityIndicator
} from 'react-native';
import dismissKeyboard from 'dismissKeyboard';
import { Actions } from 'react-native-router-flux';

export default class Login extends React.Component {

    constructor() {
        super();
        this.state = {
            username: '',
            password: ''
        };
    }

    componentWillUnmount() {
        dismissKeyboard();
    }

    render() {
        const onLogin = () => {
            dismissKeyboard();
            this.props.finalizeLogin(this.state.username, this.state.password);
        };

        const onCreateAccount = () => {
            dismissKeyboard();
            this.props.createAccount();
        };

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

        return <View style={{flex: 1}}>
            <View style={styles.container}>
                <Text>Please log in to continue:</Text>
                <View style={styles.fieldContainer}>
                    <Text>E-Mail Address: </Text>
                    <TextInput
                        style={styles.inputField}
                        onChangeText={(username) => this.setState({username})}
                        value={this.state.username}
                    />
                </View>
                <View style={styles.fieldContainer}>
                    <Text>Password: </Text>
                    <TextInput
                        style={styles.inputField}
                        onChangeText={(password) => this.setState({password})}
                        value={this.state.password}
                        secureTextEntry={true}
                    />
                </View>
                <Button onPress={onLogin} title="Log In" color="#841584" />
                <Text style={{textDecorationStyle: 'solid', color: 'blue', marginTop: 10}} onPress={onCreateAccount}>Not registered yet, click here</Text>
            </View>
        </View>;
    }
};