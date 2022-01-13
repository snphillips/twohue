import React from "react";


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
        style={{
          display: displayPlayAgainButtonStyle,
          zIndex: 3
        }}
        onClick={() => {
          // props.resetScoreForNextGame();
          props.startGameClickHandler();
        }}
      >
        play again
          </button>


    </section>
  );
}