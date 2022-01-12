import React from "react";
import CountUp from "react-countup";

let previousScore = 0;

// gotcha: if the duration of the counter is changed,
// the counter may count down then up again.


export default function StartButtons(props) {
  
  let displayPlayAgainButtonStyle;
  (props.displayPlayAgainButton ? displayPlayAgainButtonStyle = 'block' : displayPlayAgainButtonStyle = 'none')

  let startButtonDisplayStyle;
  (props.displayStartButton ? startButtonDisplayStyle = 'block' : startButtonDisplayStyle = 'none')

  return (
    <section className="start-buttons">

      <button
        className="start-button"
        style={{
          display: startButtonDisplayStyle
        }}
        onClick={() => {
          props.startGameClickHandler();
        }}
      >
        start
      </button>

      <button
        className="play-again-button"
        style={{display: displayPlayAgainButtonStyle }}
        onClick={() => {
          props.resetScoreForNextGame();
          props.startGameClickHandler();
        }}
      >
        play again
          </button>


    </section>
  );
}
