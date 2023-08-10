import React from 'react';

/*
==================================
Using react-automata's "State"
(yes- we have React-state & State-maching-state...
it gets confusing) UI elements will only display when
the game is in certain states. Note: you can have
multiple states in the State arrays

This component only displays when state is 
homeScreenPractice or showSolution
==================================
*/

export default function MessageBoard({ gameState, score, displaySolution }) {
  return (
    <section
      className='message-board'
      style={{
        display: 'block',
        height: '3rem',
      }}
    >
      {gameState === 'homeScreenPractice' && (
        <div className='into-message'>
          <p>Twohue is a color mixing game.</p>
          <p>Practice clicking bubbles before playing.</p>
        </div>
      )}

      {(gameState === 'gameOver' ||
        gameState === 'leaderboard' ||
        gameState === 'joinLeaderboard') && (
        <div className='game-over-message'>
          <p id='game-over'>game over</p>
          <p id='game-over-score'>final score: {score}</p>
        </div>
      )}

      {displaySolution && <p className='solution-label'>Solution</p>}
    </section>
  );
}
