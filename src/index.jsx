import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, compose } from 'redux';
import { Provider } from 'react-redux';
import reducer from './reducers/index';

import AppContainer from './components/App/AppContainer';

const store = createStore(reducer);

ReactDOM.render(
  <Provider store={store}>
      <AppContainer />
  </Provider>,
  document.getElementById('app')
);