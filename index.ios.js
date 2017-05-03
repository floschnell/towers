import React, {Component} from 'react';
import {AppRegistry} from 'react-native';
import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import {Provider} from 'react-redux';
import reducer from './src/reducers/index';
import AppContainer from './src/components/App/AppContainer';
import Logger, {LOG_LEVELS, reduxLogger} from './src/logger';

if (__DEV__) {
  Logger.setVerbosity(LOG_LEVELS.DEBUG);
} else {
  Logger.setVerbosity(LOG_LEVELS.INFO);
}

const store = createStore(
  reducer,
  applyMiddleware(thunk, reduxLogger(LOG_LEVELS.DEBUG))
);

class Towers extends Component {
  render() {
    return (
      <Provider store={store}>
        <AppContainer />
      </Provider>
    );
  }
}

AppRegistry.registerComponent('towers', () => Towers);
