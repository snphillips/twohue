import React from 'react';

// TODO: reuse the same button. No need for two

export default function StartButtons({ gameState, startGameClickHandler }) {
  return (
    <section className='start-buttons'>
      {gameState === 'homeScreenPractice' && (
        <button
          className='start-button'
          onClick={() => {
            startGameClickHandler(() => {});
          }}
        >
          start
        </button>
      )}
      {(gameState === 'gameOver' || gameState === 'joinLeaderboard') && (
        <button
          // className='play-again-button'
          onClick={() => {
            startGameClickHandler(() => {});
          }}
        >
          play again
        </button>
      )}
    </section>
  );
}
