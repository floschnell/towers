import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import reducer from './src/reducers/index';
import AppContainer from './src/components/App/AppContainer';
import Logger, {LOG_LEVELS, reduxLogger} from './src/logger';

if (__DEV__) {
  Logger.setVerbosity(LOG_LEVELS.DEBUG);
} else {
  Logger.setVerbosity(LOG_LEVELS.INFO);
}

Logger.log(LOG_LEVELS.DEBUG, 'hello');

const store = createStore(reducer, applyMiddleware(thunk, reduxLogger(LOG_LEVELS.DEBUG)));

ReactDOM.render(
  <Provider store={store}>
      <AppContainer />
  </Provider>,
  document.getElementById('app')
);
