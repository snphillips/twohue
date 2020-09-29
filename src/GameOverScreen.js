import React, { Component } from 'react';
import Leaderboard from './Leaderboard';
import { State } from 'react-automata';






export default class GameOverScreen extends Component {


    componentDidMount(){

      let transition = () => {
        // document.queryselector(".game-over").classList.add("pop-in")
        // document.getElementById("game-over").classList.toggle("pop-in");
        console.log("game over transition")
      }

      setTimeout(function() {
      // Transition to next round after X seconds
      transition()
      }, 2000);



    }


  render() {




    return (


    <State is={['gameOver']}>
      <div className="game-over-screen">
        <p id="game-over">game over</p>
      </div>
    </State>

    );
  }
}






       // <Leaderboard
       //   leaderboardData={this.props.leaderboardData}
       //   score={this.props.score}
       //   value={this.props.value}
       //   handleChange={this.props.handleChange}
       //   handleSubmit={this.props.handleSubmit}
       //   newLeaderboardInductee={this.props.newLeaderboardInductee}
       // />

        // <button
        //   className="play-again-button"
        //   onClick={ () => {
        //     this.props.resetScoreForNextGame();
        //     this.setState({confettiFalling: false});
        //     this.setState({playerWinRound: false});
        //     this.props.transition('START_GAME');
        // }}>
        //   play again
        // </button>
