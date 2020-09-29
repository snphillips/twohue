import React, { Component } from 'react';
import { State } from 'react-automata';


// ==================================
// Using react-automata's "State"
// (yes- we have React-state & State-maching-state...it gets confusing)
// UI elements will only display when the game is in certain states.
// Note: you can have multiple states in the State arrays
// ==================================


export default class MessageBoard extends Component {
  render() {
    return (

      <section className="message-board">

        <State is={['homeScreenPractice']}>
          <p>Twohue is a color mixing game.</p>
          <p>Practice clicking bubbles before playing.</p>
        </State>

        <State is={['attemptN']}>
          <p>Select two colors</p>
        </State>

        <State is={['showSolution']}>
          <p>Solution</p>
        </State>


    </section>

    );
  }
};


        // <State is={['gameOver', 'joinLeaderboard', 'leaderboard']}>
        //   <p className="game-over">game over</p>
        // </State>
