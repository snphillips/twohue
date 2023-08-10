import React from 'react';

// Find  handleChange & handleSubmit in App.js

export default function LeaderboardForm({
  gameState,
  handleSubmit,
  newLeaderboardInductee,
  handleChange,
}) {
  return (
    <div style={{ display: 'flex' }}>
      {gameState === 'joinLeaderboard' && (
        <div className='leaderboard-form'>
          <form onSubmit={handleSubmit}>
            <label>
              <input
                className='leaderboard-input-field'
                type='text'
                name='name'
                placeholder='nickname (max 12 char)'
                value={newLeaderboardInductee}
                onChange={handleChange}
              />
            </label>

            <input className='leaderboard-form-button' type='submit' value='submit' />
          </form>
        </div>
      )}
    </div>
  );
}
