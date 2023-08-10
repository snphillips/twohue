import React from 'react';
import LeaderboardForm from './LeaderboardForm';
// the spinner in a dependency
import ReactSpinners from '../ReactSpinners';

/*
========================
Map over the array of leaderboard winners.
Return an unordered list <ul>.
Each list item <li> contains the players number in the list,
their nickname & their score.

The leaderboard form is only displayed if the player's score is
equal to, or more than the last person in the list.

If for some reason the leaderboard doesn't load due to
a server error, the leaderboard doesn't display.
========================
*/

export default function Leaderboard({
  leaderboardServerDown,
  gameState,
  leaderboardData,
  handleChange,
  handleSubmit,
  newLeaderboardInductee,
  loadingSpinner,
}) {
  return (
    <div>
      {leaderboardServerDown !== true &&
        (gameState === 'joinLeaderboard' || gameState === 'gameOver') && (
          <div id='leaderboard-component'>
            <div className='leaderboard-title'>high scores</div>

            <ul className='leaderboard-list'>
              {leaderboardData.map((item) => {
                let playerIndex = leaderboardData.indexOf(item);

                return (
                  <li
                    key={playerIndex}
                    className='leaderboard-entry'
                    id={'leaderboard-entry' + playerIndex}
                  >
                    <span className='player-rank'>{item.player}</span>
                    <span className='player-score'>{item.score}</span>
                  </li>
                );
              })}
            </ul>

            <div className='lederboard-form-placeholder'>
              <LeaderboardForm
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                newLeaderboardInductee={newLeaderboardInductee}
                gameState={gameState}
              />

              <ReactSpinners loadingSpinner={loadingSpinner} />
            </div>
          </div>
        )}
    </div>
  );
}
