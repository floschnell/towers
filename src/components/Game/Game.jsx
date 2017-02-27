import React from 'react';
import BoardContainer from '../Board/BoardContainer';
import TowerSetContainer from '../TowerSet/TowerSetContainer';
import PlayerPlateContainer from '../PlayerPlate/PlayerPlateContainer';
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
    
    const calculateGameSurfaceSize = () => {
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
      return surfaceSize;
    }
    
    const gameSurfaceSize = calculateGameSurfaceSize();
    const leftOffset = (this.props.surfaceWidth - gameSurfaceSize) / 2;
    const topOffset = (this.props.surfaceHeight - gameSurfaceSize) / 2;
    const styles = {
      position: 'absolute',
      left: leftOffset,
      top: topOffset,
      width: gameSurfaceSize,
      height: gameSurfaceSize
    };
    const playerPlateHorizontalOrientation = leftOffset >= 100;
    
    return <div style={styles}>
      <BoardContainer surfaceSize={gameSurfaceSize} />
      <PlayerPlateContainer player="0" left={playerPlateHorizontalOrientation ? -20 : 0} top={playerPlateHorizontalOrientation ? 0 : -20} />
      <PlayerPlateContainer player="1" left={playerPlateHorizontalOrientation ? gameSurfaceSize + 20 : 0} top={playerPlateHorizontalOrientation ? 0 : gameSurfaceSize + 20} />
      <TowerSetContainer player="0" surfaceSize={gameSurfaceSize} />
      <TowerSetContainer player="1" surfaceSize={gameSurfaceSize} />
      {dialog}
    </div>;
  }
}