import React, { Component } from 'react';
import { Action, withStateMachine, State } from 'react-automata'





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

        <State is={['colorGuessIncorrect']}>
          <p>Incorrect guess</p>
        </State>

        <State is={['showSolution']}>
          <p>Solution</p>
        </State>

        <State is={['gameOver']}>
          <p className="game-over">game over</p>
        </State>


        <State is={['gameOver']}>
          <button className="play-again-button"
            onClick={ () => {
            this.props.resetScore()
            this.props.transition('PLAY_AGAIN')
          }}>
            play again
          </button>
        </State>

    </section>

    );
  }
};


