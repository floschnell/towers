import React from 'react';
import ReactDOM from 'react-dom';
import {createStore, compose} from 'redux';
import {Provider} from 'react-redux';
import BoardContainer from './containers/BoardContainer';
import reducer from './reducers/index';

const store = createStore(reducer, undefined, compose(window.devToolsExtension()));

ReactDOM.render(
  <Provider store={store}>
    <BoardContainer />
  </Provider>,
  document.getElementById('app')
);