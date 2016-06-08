import React from 'react';
import BoardContainer from '../Board/BoardContainer';
import TowerSetContainer from '../TowerSet/TowerSetContainer';
import Dialog from '../Dialog/Dialog';

export default class Game extends React.Component {
  
  onResize(e) {
    this.props.resizeGameSurface(window.innerWidth, window.innerHeight);
  }
  
  componentWillMount() {
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
    
    const leftOffset = this.props.gameSurfaceWidth ? (this.props.gameSurfaceWidth - this.props.gameSurfaceSize) / 2 : 0;
    const topOffset = this.props.gameSurfaceHeight ? (this.props.gameSurfaceHeight - this.props.gameSurfaceSize) / 2 : 0;
    const styles = {
      position: 'absolute',
      left: leftOffset,
      top: topOffset,
      width: this.props.gameSurfaceSize,
      height: this.props.gameSurfaceSize
    };
    
    return <div style={styles}>
      <BoardContainer />
      <TowerSetContainer player="0" />
      <TowerSetContainer player="1" />
      {dialog}
    </div>;
  }
}