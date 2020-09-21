import React, { Component } from 'react';
import { State } from 'react-automata';


export default class LeaderboardForm extends Component {
  render() {
    return (

    <State is={['gameOver', 'joinLeaderboard']}>
      <div className="leaderboard-form">

        <form
          // onSubmit={"return false;"}
          onSubmit={this.props.handleLeaderboardSubmit}
          >

          <label
            className="leaderboard-form-label"
            htmlFor="fname"
            >
              nickname:
          </label>

          <input
            type="text"
            id="fname"
            name="fname"
            placeholder="max 12 characters"
            defaultValue=""
            value={this.props.value}
            // onKeyPress allows user to hit "enter" to submit form
            onKeyPress={this.props.handleLeaderboardChange}
            onChange={() => {
              console.log("input field", this.props.value)
              console.log("handleChange", this.props.handleLeaderboardChange)
            }}
            />
          <div className="submit-button-div">
            <input
              className="submit-button"
              type="submit"
              value="submit"
              name="button"
              onSubmit={this.props.handleLeaderboardSubmit}
              />
          </div>

        </form>

      </div>
    </State>


    );
  }
}


