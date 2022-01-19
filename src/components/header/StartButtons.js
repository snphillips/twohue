import React from "react";


export default function StartButtons(props) {
  
  return (
    <section className="start-buttons">

    {props.displayStartButton && 
      <button
      className="start-button"
      onClick={ () => {
        props.startGameClickHandler( () => {
          props.setUpRoundN();
        });
      }}
      >
        start
      </button>
    }
    {props.displayPlayAgainButton &&
      <button
        className="play-again-button"
        style={{
          display: props.displayPlayAgainButton
        }}
        onClick={() => {
          props.startGameClickHandler( () => {
            props.setUpRoundN();
          });
        }}
      >
        play again
          </button>
    }

    </section>
  );
}
