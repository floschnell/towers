import React from 'react';

/**
 * Web version of the create game component.
 */
export default class CreateGame extends React.Component {
  /**
   * @override
   */
  render() {
    const renderPlayers = () => {
      return Object.keys(this.props.players).map((opponentID) => {
        const playerID = this.props.player.id;
        const player = this.props.player;
        const opponent = this.props.players[opponentID];
        const startGameOnClick = () => {
          this.props.startGame(playerID, opponentID, {
            [playerID]: player,
            [opponentID]: opponent,
          });
        };

        return (
          <li key={opponentID} onClick={startGameOnClick}>
            {this.props.players[opponentID].name}
          </li>
        );
      });
    };

    const searchPlayers = () => {
      this.props.searchForPlayers(this.refs.searchStr.value);
    };

    return (
      <div className="dashboard">
        <div className="dashboard__back-button" onClick={this.props.goToDashboard}>
          Zurück
        </div>
        <input ref="searchStr" type="text" onChange={searchPlayers} />
        <ul className="dashboard__list">{renderPlayers()}</ul>
      </div>
    );
  }
}

CreateGame.propTypes = {
  player: React.PropTypes.object,
  players: React.PropTypes.object,
  startGame: React.PropTypes.func.isRequired,
  searchForPlayers: React.PropTypes.func.isRequired,
  goToDashboard: React.PropTypes.func.isRequired,
};
