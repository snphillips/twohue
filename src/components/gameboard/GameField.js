import React from 'react';

export default function GameField({ gameState, colorRound, leftFieldStyle, rightFieldStyle }) {
  return (
    <section>
      {gameState !== 'joinLeaderboard' &&
        gameState !== 'leaderboard' &&
        gameState !== 'gameOver' && (
          <div>
            <div id='target-swatch' style={{ backgroundColor: colorRound.targetColor }}>
              &nbsp;
              <span className='tooltiptext'>target color</span>
            </div>

            <section id='left-and-right-field'>
              <div className='field' id='left-field' style={leftFieldStyle}>
                &nbsp;
              </div>

              <div className='field' id='right-field' style={rightFieldStyle}>
                &nbsp;
              </div>
            </section>
          </div>
        )}
    </section>
  );
}
