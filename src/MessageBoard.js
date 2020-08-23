import React, { Component } from 'react';
import { Action, withStateMachine, State } from 'react-automata'







export default class MessageBoard extends Component {
  render() {
    return (

        <section className="message-board">

        <State is={['homeScreenPractice']}>
          <p>Twohue is a color mixing game.</p>
          <p>Win by chooose two colors that create the target color when mixed.</p>
          <p>Practice clicking bubbles before playing.</p>
        </State>

        <State is={['attemptN']}>
          <p>Select a color</p>
        </State>

        <State is={['attemptFinal']}>
          <p>One last guess remaining</p>
        </State>

        <State is={['colorGuessIncorrect']}>
          <p>Incorrect guess</p>
        </State>

        <State is={['showSolution']}>
          <p>Solution</p>
        </State>

        <State is={['gameOver']}>
          <p>game over</p>
        </State>

        <State is={['playerWinsRound', 'playerLoosesRound']}>
          <button onClick={ () => {
            this.props.transition('NEXT_ROUND')
            console.log('NEXT_ROUND')
          }}>
            next round
          </button>
        </State>


        <State is={['homeScreenPractice']}>
          <button onClick={ () => {
            this.props.transition('START_GAME')
          }}>
            start
          </button>
        </State>

        <State is={['gameOver']}>
          <button onClick={ () => {
            this.props.transition('PLAY_AGAIN')
          }}>
            play again
          </button>
        </State>

        <State is={['gameOver']}>
          <button onClick={ () => {
            this.props.transition('DONT_PLAY_AGAIN')
          }}>
            don't play again
          </button>
        </State>

      </section>

    );
  }
}















