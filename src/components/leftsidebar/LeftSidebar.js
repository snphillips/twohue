import React from 'react';

export default function LeftSidebar({ gameState, gameOver }) {
  return (
    <div>
      <section className='title-section'>
        <h1>twohue</h1>
      </section>

      {gameState !== 'homeScreenPractice' &&
        gameState !== 'gameOver' &&
        gameState !== 'joinLeaderboard' && (
          <button
            className='end-game-button'
            onClick={() => {
              gameOver(() => {});
            }}
          >
            end game
          </button>
        )}
    </div>
  );
}
