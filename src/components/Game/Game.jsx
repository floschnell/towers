import React from 'react';
import BoardContainer from '../Board/BoardContainer';
import TowerSetContainer from '../TowerSet/TowerSetContainer';
import Dialog from '../Dialog/Dialog';
import { hashHistory } from 'react-router';

export default class Game extends React.Component {
  
  onResize(e) {
    this.props.resizeGameSurface(window.innerWidth, window.innerHeight);
  }
  
  componentWillMount() {
    if (this.props.playerName === null) {
      hashHistory.push('/');
      this.render = () => false;
    }
    this.onResize();
  }
  
  componentDidMount() {
    window.addEventListener('resize', this.onResize.bind(this));
  }
  
  componentWilUnmount() {
    window.removeEventListener('resize');
  }
  
  render() {
    let dialog = '';
    if (this.props.won) {
      const dialogButtons = [{
        text: 'Again',
        action: event => console.log('play again...')
      },{
        text: 'End',
        action: event => this.props.endGame(this.props.game, this.props.playerName)
      }]
      dialog = <Dialog zIndex="10" message="You have won!" buttons={dialogButtons} />
    } else if (this.props.lost) {
      const dialogButtons = [{
        text: 'Again',
        action: event => console.log('play again...')
      },{
        text: 'End',
        action: event => this.props.endGame(this.props.game, this.props.playerName)
      }]
      dialog = <Dialog zIndex="10" message="You have lost!" buttons={dialogButtons} />
    }
    
    let surfaceSize = 0;
    if (this.props.surfaceWidth < this.props.surfaceHeight) {
      if (this.props.surfaceHeight - this.props.surfaceWidth < 200) {
        surfaceSize = this.props.surfaceHeight - 200;
      } else {
        surfaceSize = this.props.surfaceWidth;
      }
    } else {
      if (this.props.surfaceWidth - this.props.surfaceHeight < 200) {
        surfaceSize = this.props.surfaceWidth - 200;
      } else {
        surfaceSize = this.props.surfaceHeight;
      }
    }
    
    const leftOffset = (this.props.surfaceWidth - surfaceSize) / 2;
    const topOffset = (this.props.surfaceHeight - surfaceSize) / 2;
    const styles = {
      position: 'absolute',
      left: leftOffset,
      top: topOffset,
      width: surfaceSize,
      height: surfaceSize
    };
    
    return <div style={styles}>
      <BoardContainer surfaceSize={surfaceSize} />
      <TowerSetContainer player="0" surfaceSize={surfaceSize} />
      <TowerSetContainer player="1" surfaceSize={surfaceSize} />
      {dialog}
    </div>;
  }
}