import React, { Component } from 'react';
import axios from 'axios';



export default class LeaderboardForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // value: ''
    };


  }


  render() {
    return (

        <div className="leaderboard-form">

          <form
            onSubmit={this.props.handleSubmit}
            >

          <label>
            Name:
            <input
              type="text"
              name="name"
              value={this.props.newLeaderboardInductee}
              onChange={this.props.handleChange}
              />
          </label>

          <input
            type="submit"
            value="Submit"
          />

         </form>
        </div>
    );
  }
}




