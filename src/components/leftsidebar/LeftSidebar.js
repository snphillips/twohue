import React from 'react';

export default function LeftSidebar(props) {
  return (
    
    <div>
      <section className="title-section">
        <h1>twohue</h1>
      </section>

      {props.gameState !== "homeScreenPractice" && 
       props.gameState !== "gameOver" &&
       props.gameState !== "joinLeaderboard" &&

       <button
       className="end-game-button"
       onClick={() => {
          props.gameOver( () => {
         });
       }}
     >
        end game
      </button>
      }

    </div>
  
  );
}
