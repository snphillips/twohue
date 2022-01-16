import React from "react";


export default function StartButtons(props) {
  
  return (
    <section className="start-buttons">

      <button
        className="start-button"
        style={{display: props.displayStartButton}}
        onClick={ () => {
          props.startGameClickHandler( () => {
            props.setUpRoundN();
          });
        }}
      >
        start
      </button>

      <button
        className="play-again-button"
        style={{
          display: props.displayPlayAgainButton,
          zIndex: 3
        }}
        onClick={() => {
          props.startGameClickHandler( () => {
            props.setUpRoundN();
          });
        }}
      >
        play again
          </button>


    </section>
  );
}
