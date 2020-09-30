import React, { Component } from 'react';
// import Leaderboard from './Leaderboard';
import { State } from 'react-automata';

//=========================================
// Xstate is: gameOverTransition

// The word <Game Over> fades in, then pops out.
// Then, then user is moved onto the next
// state, either joinLeaderboard or leaderboard

//=========================================


let displayGameOver = () => {
  console.log("game over")
  document.getElementById("game-over").classList.add("fade-in")
  document.getElementById("game-over-screen").classList.add("fade-in")
}


export default class GameOverScreen extends Component {


    componentDidMount(){

      displayGameOver()

      // let transition = () => {
      //   console.log("game over transition to leaderboard")
      //   this.props.transition('GAME_OVER_TRANSITION')
      // }

      // setTimeout(function() {
      // // Transition to leaderboard after X seconds
      // transition()
      // }, 2000);



    }


  render() {




    return (


      <div id="game-over-screen" className="fade-in">
        <p id="game-over" className="fade-in">
           game over
        </p>
      </div>

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
