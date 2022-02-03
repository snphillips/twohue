import React from "react";
import CountUp from "react-countup";



/* ==============================
GOTCHA: if the duration of the counter is changed,
the counter may count down then up again.

Displaying the score board based on what gameState the app
is in. As long as the gameState is NOT homeScreenPractice, 
gameOver or joinLeaderboard, then display the scoreboard
============================== */



export default function StartButtons(props) {
    
  return (
    <section className="score-board">

    { props.gameState != "homeScreenPractice" && 
      props.gameState != "gameOver" &&
      props.gameState != "joinLeaderboard" &&
      
      <div className='scoreboard'>
        <p className="score-word">
          score:
          <span className="actual-score">
            <CountUp
              start={props.previousScore}
              end={props.score}
              duration={1.5}
              />
          </span>
        </p>
        
        <p>roundz: {props.roundz}</p>

        
        <p>
          attempt: {props.attempt}/{props.maxAttemptCount}
        </p>

        <p className="loses">
          lives: {props.lostRounds}/{props.maxLossCount}
        </p>
      </div>
    }
      </section>
  );
}
