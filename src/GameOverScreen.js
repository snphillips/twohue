import React, { Component } from "react";
import { State } from "react-automata";

//=========================================
// Xstate is: gameOverTransition

// The phrase Game Over pops-in, then pops-out.
// Then user is moved onto the next
// state, either joinLeaderboard or leaderboard
//=========================================

let displayGameOver = () => {
  console.log("game over pop-in");
  document.getElementById("game-over-container").classList.add("pop-in");
};

let hideGameOver = () => {
  console.log("game over pop-out");
  document.getElementById("game-over-container").classList.remove("pop-in");
  document.getElementById("game-over-container").classList.add("pop-out");
};


export default class GameOverScreen extends Component {


  // Begin animations once the component has mounted
  componentDidMount() {
    displayGameOver();
  }


  render() {
    return (
      <div id="game-over-container" className="pop-in">
        <p id="game-over">game over</p>
        <p id="game-over-score">final score: {this.props.score}</p>
      </div>
    );
  }
}
