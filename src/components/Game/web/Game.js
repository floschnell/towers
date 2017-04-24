import React from 'react';
import BoardContainer from '../../Board/BoardContainer';
import TowerSetContainer from '../../TowerSet/TowerSetContainer';
import PlayerPlateContainer from '../../PlayerPlate/PlayerPlateContainer';
import Dialog from '../../Dialog/Dialog';
import css from './Game.styl';
import closeButton from '../../../../resources/close.png';
import Logger from '../../../logger';

let timeoutHandler = 0;

export default class Game extends React.Component {

  constructor() {
    super();
    this.resizeListener = this.onResize.bind(this);
  }
  
  onResize(e) {
    if (timeoutHandler) {
      clearTimeout(timeoutHandler);
    }
    timeoutHandler = setTimeout(() => {
      this.props.resizeGameSurface(window.innerWidth, window.innerHeight);
    }, 500);
  }
  
  componentWillMount() {
    this.onResize();
  }
  
  componentDidMount() {
    window.addEventListener('resize', this.resizeListener);
  }
  
  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeListener);
  }
  
  render() {
    const size = this.props.width < this.props.height ? this.props.width : this.props.height;
    const playerOneTowers = this.props.towerPositions[this.props.playerIDs[0]];
    const playerTwoTowers = this.props.towerPositions[this.props.playerIDs[1]];

    let dialog = '';
    if (this.props.won) {
      const dialogButtons = [{
        text: 'End',
        action: event => this.props.endGame(this.props.game, this.props.playerID)
      }]
      dialog = <Dialog zIndex="10" message="You have won!" buttons={dialogButtons} />
    } else if (this.props.lost) {
      const dialogButtons = [{
        text: 'End',
        action: event => this.props.endGame(this.props.game, this.props.playerID)
      }]
      dialog = <Dialog zIndex="10" message="You have lost!" buttons={dialogButtons} />
    }
    
    const calculateGameSurfaceSize = () => {
      const height = this.props.surfaceHeight - 150;
      const width = this.props.surfaceWidth - 10;

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

    const orientationMode = playerPlateHorizontalOrientation ? 'horizontal' : 'vertical';

    const suspendGame = () => {
      this.props.suspendGame(this.props.game);
      this.props.goToDashboard();
    };
    
    return <div style={gameSurfaceStyles}>
      <BoardContainer surfaceSize={gameSurfaceSize} />
      <div style={player1PlateStyles} ><PlayerPlateContainer mode={orientationMode} player={this.props.playerIDs[0]} height={topOffset} width={leftOffset} surface={gameSurfaceSize} /></div>
      <div style={player2PlateStyles} ><PlayerPlateContainer mode={orientationMode} player={this.props.playerIDs[1]} height={topOffset} width={leftOffset} surface={gameSurfaceSize} /></div>
      <TowerSetContainer towers={playerOneTowers} size={gameSurfaceSize} />
      <TowerSetContainer towers={playerTwoTowers} size={gameSurfaceSize} />
      <div className="close-button" onClick={suspendGame.bind(this)}><img src={closeButton} /></div>
      {dialog}
    </div>;
  }
}