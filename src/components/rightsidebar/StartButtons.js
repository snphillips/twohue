import React from "react";


export default function StartButtons(props) {
  
  return (
    <section className="start-buttons">

    {props.gameState === 'homeScreenPractice' && 
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
    {props.gameState === 'gameOver' ||
     props.gameState === 'joinLeaderboard' && 
      <button
        className="play-again-button"
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
