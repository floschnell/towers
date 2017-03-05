/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';

import { createStore, compose } from 'redux';
import { Provider } from 'react-redux';
import reducer from './src/reducers/index';
import AppContainer from './src/components/App/AppContainer';

const store = createStore(reducer);

export default class towers extends Component {
  render() {
    return (
      <Provider store={store}>
          <AppContainer />
      </Provider>
    );
  }
};

AppRegistry.registerComponent('towers', () => towers);
