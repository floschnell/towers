import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, compose, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import reducer from './reducers/index';
import thunk from 'redux-thunk';

import AppContainer from './components/App/AppContainer';

const store = createStore(reducer, applyMiddleware(thunk));

ReactDOM.render(
  <Provider store={store}>
      <AppContainer />
  </Provider>,
  document.getElementById('app')
);