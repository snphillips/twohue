import React from 'react';
import CountUp from 'react-countup';

/* ==============================
GOTCHA: if the duration of the counter is changed,
the counter may count down then up again.

Displaying the score board based on what gameState the app
is in. As long as the gameState is NOT homeScreenPractice, 
gameOver or joinLeaderboard, then display the scoreboard
============================== */

export default function StartButtons({
  gameState,
  previousScore,
  score,
  round,
  attempt,
  maxAttemptCount,
  lostRounds,
  maxLossCount,
}) {
  return (
    <section className='score-board'>
      {gameState !== 'homeScreenPractice' &&
        gameState !== 'gameOver' &&
        gameState !== 'joinLeaderboard' && (
          <div className='scoreboard'>
            <p className='score-word'>
              score:
              <span className='actual-score'>
                <CountUp start={previousScore} end={score} duration={1.5} />
              </span>
            </p>

            <p>round: {round}</p>

            <p>
              attempt: {attempt}/{maxAttemptCount}
            </p>

            <p className='loses'>
              lives: {lostRounds}/{maxLossCount}
            </p>
          </div>
        )}
    </section>
  );
}
