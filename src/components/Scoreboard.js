import React from "react";
import CountUp from "react-countup";

// gotcha: if the duration of the counter is changed,
// the counter may count down then up again.



export default function StartButtons(props) {
    
  return (
    <section className="score-board">
    { props.displayScoreBoard &&
      <div
        className='scoreboard'
        style={{display: props.displayScoreBoard}}
        >
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

        <p>round: {props.round}</p>
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
