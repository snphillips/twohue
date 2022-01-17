import React from 'react';

// Find  handleChange & handleSubmit in App.js


export default function LeaderboardForm(props) {
    return (

        <div 
          style={{display: props.displayLeaderboardForm}}
          className="leaderboard-form"
          >

          <form
            onSubmit={props.handleSubmit}
            >

          <label>
            <input
              className="leaderboard-input-field"
              type="text"
              name="name"
              placeholder='nickname (max 12 char)'
              value={props.newLeaderboardInductee}
              onChange={props.handleChange}
              />
          </label>

          <input
            className="leaderboard-form-button"
            type="submit"
            value="submit"
          />

         </form>

        </div>
    );
}


