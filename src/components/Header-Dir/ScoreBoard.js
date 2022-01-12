import React from "react";
import CountUp from "react-countup";

let previousScore = 0;

// gotcha: if the duration of the counter is changed,
// the counter may count down then up again.


export default function StartButtons(props) {
  
  let scoreDisplay;
  (props.displayScoreBoard ? scoreDisplay = 'block' : scoreDisplay = 'none')

  return (
    <section className="score-board">
      <div
        className='scoreboard'
        style={{
          display: scoreDisplay,
        }}
      >
        <p className="score-word">
          score:&nbsp;
          <span className="actual-score">
            <CountUp
              start={previousScore}
              end={props.score}
              duration={1.5}
              onEnd={() => {
                previousScore = props.score;
                // console.log( "Count up done: previousScore:", previousScore, "props.score:", props.score)
              }}
            />
          </span>
        </p>

        <p>
          attempt: {props.attempt}/{props.maxAttemptCount}
        </p>

        <p className="loses">
          flops: {props.looseRound}/{props.maxLossCount}
        </p>
      </div>
    </section>
  );
}
