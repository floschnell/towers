import {
  ActivityIndicator,
  Text,
  View,
  Button,
  TextInput,
  StyleSheet,
} from 'react-native';
import React from 'react';

/**
 * Native form to create a new account.
 */
export default class CreateAccount extends React.Component {
  /**
   * Instantiates a new create account form.
   */
  constructor() {
    super();
    this.state = {
      username: '',
      mail: '',
      password: '',
      repeatPassword: '',
    };
  }

  /**
   * @override
   */
  render() {
    const styles = StyleSheet.create({
      fieldContainer: {
        margin: 5,
        flexDirection: 'row',
        alignItems: 'center',
      },
      inputField: {
        height: 40,
        width: 150,
      },
    });

    const createActivityIndicator = () => {
      if (this.props.isLoading) {
        return (
          <View
            style={{
              zIndex: 2,
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              position: 'absolute',
              left: 0,
              top: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'white',
              opacity: 0.5,
            }}
          >
            <ActivityIndicator size="large" />
          </View>
        );
      } else {
        return null;
      }
    };

    const createAccount = (event) => {
      this.props.createAccount(
        this.state.username,
        this.state.mail,
        this.state.password,
        this.state.repeatPassword
      );
    };

    const changeUsername = (username) => {
      this.setState({username});
      this.props.checkUsername(username);
    };

    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <View style={styles.fieldContainer}>
          <Text>Username: </Text>
          <TextInput
            style={{
              height: 40,
              width: 150,
              color: this.props.usernameValid ? 'green' : 'red',
            }}
            onChangeText={changeUsername.bind(this)}
            value={this.state.username}
          />
        </View>
        <View style={styles.fieldContainer}>
          <Text>Mail Address: </Text>
          <TextInput
            style={styles.inputField}
            onChangeText={(mail) => this.setState({mail})}
            value={this.state.mail}
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
        <View style={styles.fieldContainer}>
          <Text>Password (repeat): </Text>
          <TextInput
            style={styles.inputField}
            onChangeText={(repeatPassword) => this.setState({repeatPassword})}
            value={this.state.repeatPassword}
            secureTextEntry={true}
          />
        </View>
        <Button title="Create Account" onPress={createAccount} />
        {createActivityIndicator()}
      </View>
    );
  }
}

CreateAccount.propTypes = {
  checkUsername: React.PropTypes.func,
  usernameValid: React.PropTypes.bool,
  createAccount: React.PropTypes.func,
  isLoading: React.PropTypes.bool,
};
