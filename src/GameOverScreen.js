import React, { Component } from "react";
import { State } from "react-automata";

//=========================================
// Xstate is: gameOverTransition

// The word <Game Over> pops-in, then pops-out.
// Then, then user is moved onto the next
// state, either joinLeaderboard or leaderboard
//=========================================

let displayGameOver = () => {
  console.log("game over pop-in");
  document.getElementById("game-over-container").classList.add("pop-in");
  document.getElementById("game-over").classList.add("pop-in");
};

let hideGameOver = () => {
  console.log("game over pop-out");
  document.getElementById("game-over-container").classList.remove("pop-in");
  document.getElementById("game-over-container").classList.add("pop-out");
  document.getElementById("game-over").classList.remove("pop-in");
  document.getElementById("game-over").classList.add("pop-out");
};




export default class GameOverScreen extends Component {


  // Begin animations when the component has mounted
  componentDidMount() {

    displayGameOver();

    // setTimeout(function() {
    // // hideGameOver() to be executed after x seconds
    // hideGameOver()
    // }, 2500);


  }





  render() {
    return (
      <div id="game-over-container" className="pop-in">
        <p id="game-over" className="pop-in">
          game over
        </p>
      </div>
    );
  }
}
