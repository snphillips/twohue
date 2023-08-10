import React from 'react';
import StartButtons from './StartButtons';
import Scoreboard from './Scoreboard';

export default function RightSidebar({
  score,
  round,
  lostRounds,
  attempt,
  maxLossCount,
  maxAttemptCount,
  previousScore,
  setPreviousScore,
  gameState,
  startGameClickHandler,
  setUpRoundN,
}) {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
      <Scoreboard
        score={score}
        round={round}
        lostRounds={lostRounds}
        attempt={attempt}
        maxLossCount={maxLossCount}
        maxAttemptCount={maxAttemptCount}
        previousScore={previousScore}
        setPreviousScore={setPreviousScore}
        gameState={gameState}
      />

      <StartButtons
        startGameClickHandler={startGameClickHandler}
        setUpRoundN={setUpRoundN}
        gameState={gameState}
      />
    </div>
  );
}
