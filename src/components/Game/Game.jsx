import React from 'react';
import BoardContainer from '../Board/BoardContainer';
import TowerSetContainer from '../TowerSet/TowerSetContainer';

export default class Game extends React.Component {
  render() {
    return <div>
      <BoardContainer />
      <TowerSetContainer player="0" />
      <TowerSetContainer player="1" />
    </div>;
  }
}