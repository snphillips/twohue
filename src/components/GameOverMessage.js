import React, { useEffect } from 'react';

/*
=========================================
NOTE - NOT USING

The Game Over & Final Score bubble pops-in, then pops-out.
Then user is moved onto the next
state, either joinLeaderboard or leaderboard
=========================================
*/

export default function GameOverScreen(props) {

  // let displayGameOver = () => {
  //   console.log("game over pop-in");
  //   document.getElementById("game-over-container").classList.add("pop-in");
  // };

  // useEffect has empty array as dependency.
  // Will only run upon first render
    useEffect(() => {
       
      if (props.displayGameOverMessage === false) {
        return
      }
    // Begin "game over" pop-out once the component has mounted
    // displayGameOver();
    console.log("game over pop-in");
    document.getElementById("game-over-container").classList.add("pop-in");
    // Pop-in after x seconds
    setTimeout(function(){
      console.log("game over pop-out");
      document.getElementById("game-over-container").classList.remove("pop-in");
      document.getElementById("game-over-container").classList.add("pop-out");
    }, 2750);
  // }
}, [props.displayGameOverMessage]);

    return (
      <div>
        {props.displayGameOverMessage &&
          <div 
          id="game-over-container"
          className="pop-in"
          style={{
            display: props.displayGameOverMessage
            // opacity: 0
          }}
          >
              <p id="game-over">game over</p>
              <p id="game-over-score">final score: {props.score}</p>
          </div>
        }      
      </div>
    );

}
