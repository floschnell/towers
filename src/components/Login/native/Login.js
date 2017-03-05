import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    Button
} from 'react-native';

export default class Login extends React.Component {

        constructor() {
            super();
            this.state = {
                username: '',
                password: ''
            };
        }

    render() {
        const onLogin = e => {
            this.props.finalizeLogin(this.state.username, this.state.password);
        };

        const onCreateAccount = e => {
            // ok
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

        return <View style={styles.container}>
            <Text>Please log in to continue:</Text>
            <View style={styles.fieldContainer}>
                <Text>Username: </Text>
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
            <Button onPress={onLogin} title="Log In" color="#841584" accessibilityLabel="Learn more about this purple button" />
        </View>;
    }
};