import React, { Component } from 'react';
import Leaderboard from './Leaderboard';





export default class GameOverScreen extends Component {
  render() {
    return (


    <div className="game-over-screen">

       <Leaderboard
         leaderboardData={this.props.leaderboardData}
         score={this.props.score}
         value={this.props.value}
         handleLeaderboardChange={this.props.handleLeaderboardChange}
         handleLeaderboardSubmit={this.props.handleLeaderboardSubmit}
       />

        <button
          className="play-again-button"
          onClick={ () => {
            this.props.resetScoreForNextGame();
            this.setState({confettiFalling: false});
            this.setState({playerWinRound: false});
            this.props.transition('PLAY_AGAIN');
        }}>
          play again
        </button>

    </div>

    );
  }
}


