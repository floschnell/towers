import React from 'react';
import BoardContainer from '../Board/BoardContainer';
import TowerSetContainer from '../TowerSet/TowerSetContainer';
import PlayerPlateContainer from '../PlayerPlate/PlayerPlateContainer';
import Dialog from '../Dialog/Dialog';
import { hashHistory } from 'react-router';
import css from './Game.styl';
import closeButton from '../../../graphics/close.png';

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
      const height = this.props.surfaceHeight - 150;
      const width = this.props.surfaceWidth;

      return height > width ? width : height;
    }
    
    const gameSurfaceSize = calculateGameSurfaceSize();
    const leftOffset = (this.props.surfaceWidth - gameSurfaceSize) / 2;
    const topOffset = (this.props.surfaceHeight - gameSurfaceSize) / 2;
    const playerPlateHorizontalOrientation = leftOffset < 100;

    const gameSurfaceStyles = {
      position: 'absolute',
      left: leftOffset,
      top: topOffset,
      width: gameSurfaceSize,
      height: gameSurfaceSize
    };

    const player1PlateStyles = Object.assign({
      display: 'block',
      position: 'absolute'
    }, {
      width: '100%',
      height: topOffset,
      top: -topOffset,
      left: 0
    });

    const player2PlateStyles = Object.assign({
      display: 'block',
      position: 'absolute'
    }, {
      height: topOffset,
      width: '100%',
      top: gameSurfaceSize,
      left: 0
    });

    const goToDashboard = () => {
      hashHistory.push('/dashboard.html');
    };
    const orientationMode = playerPlateHorizontalOrientation ? 'horizontal' : 'vertical';
    
    return <div style={gameSurfaceStyles}>
      <BoardContainer surfaceSize={gameSurfaceSize} />
      <div style={player1PlateStyles} ><PlayerPlateContainer mode={orientationMode} player={this.props.playerUIDs[0]} height={topOffset} width={leftOffset} surface={gameSurfaceSize} /></div>
      <div style={player2PlateStyles} ><PlayerPlateContainer mode={orientationMode} player={this.props.playerUIDs[1]} height={topOffset} width={leftOffset} surface={gameSurfaceSize} /></div>
      <TowerSetContainer player={this.props.playerUIDs[0]} surfaceSize={gameSurfaceSize} />
      <TowerSetContainer player={this.props.playerUIDs[1]} surfaceSize={gameSurfaceSize} />
      <div className="close-button" onClick={goToDashboard}><img src={closeButton} /></div>
      {dialog}
    </div>;
  }
}