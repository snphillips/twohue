import React, { useEffect } from 'react';

/*
=========================================
Xstate On Entry State is: gameOverTransition

The Game Over & Final Score bubble pops-in, then pops-out.
Then user is moved onto the next
state, either joinLeaderboard or leaderboard
=========================================
*/

let displayGameOver = () => {
  // console.log("game over pop-in");
  document.getElementById("game-over-container").classList.add("pop-in");
};


export default function GameOverScreen(props) {

  // useEffect has empty array as dependency.
  // Will only run upon render
    useEffect(() => {
    // Begin "game over" animation once the component has mounted
    displayGameOver();
    // End animation once the component has mounted
    setTimeout(function(){
      console.log("game over pop-out");
      document.getElementById("game-over-container").classList.remove("pop-in");
      document.getElementById("game-over-container").classList.add("pop-out");
    }, 2500);
  // }
}, []);

    return (
      <div id="game-over-container" className="pop-in">
        <p id="game-over">game over</p>
        <p id="game-over-score">final score: {props.score}</p>
      </div>
    );

}
