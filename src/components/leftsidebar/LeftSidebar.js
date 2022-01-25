import React from 'react';

export default function LeftSidebar(props) {
  return (
    
    <div>
    <section className="title-section">
      <h1>twohue</h1>
    </section>

    {props.displayGameOverMessage && 
      <div className="game-over-message">
        <p id="game-over">game over</p>
        <p id="game-over-score">final score: {props.score}</p>
      </div>
    } 
    </div>
  
  );
}
