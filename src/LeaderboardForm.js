import React, { Component } from 'react';



export default class LeaderboardForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
    console.log("value:",  event.target.value)
  }

  handleSubmit(event) {
    console.log('A name submitted: ' + this.state.value);
    event.preventDefault();
  }

  render() {
    return (

        <div className="leaderboard-form">

          <form
            onSubmit={this.handleSubmit}
            >

          <label>
            Name:
            <input
              type="text"
              name="name"
              value={this.state.value}
              onChange={this.handleChange}
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




