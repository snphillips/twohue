import React, { Component } from 'react';


export default class LeaderboardForm extends Component {
  render() {
    return (


    <div className="leaderboard-form">

      <form
        // onSubmit={"return false;"}
        >

        <label
          className="leaderboard-form-label"
          htmlFor="fname">
            nickname:
        </label>

        <input
          type="text"
          id="fname"
          name="fname"
          placeholder="max 12 characters"
          defaultValue=""
          onChange={() => {
            console.log("input field", this.value)
          }}
          />
        <div className="submit-button-div">
          <input
            className="submit-button"
            type="submit"
            value="submit"
            name="button"
            onSubmit={ () => {
              console.log("form action button")
            }}
            />
        </div>

      </form>

    </div>

    );
  }
}


