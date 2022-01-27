import React from "react";
import { send } from "xstate/lib/actionTypes";


export default function StartButtons(props) {
  
  return (
    <section className="start-buttons">

    {props.displayStartButton && 
      <button
      className="start-button"
      onClick={ () => {
        props.startGame( () => {
          // props.setUpRoundN();
          // send('ONTO_INCREMENT_ROUND')
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
          props.startGame( () => {
            // props.setUpRoundN();
            // send('ONTO_INCREMENT_ROUND')
          });
        }}
      >
        play again
          </button>
    }

    </section>
  );
}
