import React, { Component } from 'react';
import Leaderboard from './Leaderboard';





export default class GameOverScreen extends Component {
  render() {
    return (


   // button doesn't work

    <div className="game-over-screen">

       <Leaderboard
         leaderboardData={this.props.leaderboardData}
         score={this.props.score}
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


