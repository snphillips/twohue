import React, { Component } from 'react';
import { State } from 'react-automata';
// the spinner in an npm package
import ReactSpinners from './ReactSpinners';


// ================================
// View handleChange & handleSubmit in App.js
// ================================


export default class LeaderboardForm extends React.Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //   };


  // }


  render() {



    return (


        <div className="leaderboard-form">

          <form
            onSubmit={this.props.handleSubmit}
            >

          <label>
            <input
              className="leaderboard-input-field"
              type="text"
              name="name"
              placeholder='nickname (max 12 char)'
              value={this.props.newLeaderboardInductee}
              onChange={this.props.handleChange}
              />
          </label>

          <input
            className="leaderboard-form-button"
            type="submit"
            value="submit"
          />

         </form>

         <State is={['leaderboardAPICall']}>
           <ReactSpinners loading={this.props.loading} />
         </State>


        </div>
    );
  }
}




