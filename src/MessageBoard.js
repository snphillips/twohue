import React, { Component } from 'react';
import { Action, withStateMachine, State } from 'react-automata'







export default class MessageBoard extends Component {
  render() {
    return (

        <section className="message-board">

        <State is={['homeScreenPractice']}>
          <p>Welcome to twohue, a color mixing game.</p>
          <p>The aim is to chooose two colors that mix to create the target color.</p>
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

        <State is={['gameOver']}>
          <p>game over</p>
        </State>

        <State is={['roundN', 'roundFinal', 'incrementRoundCounter', 'attemptN', 'checkColor', 'colorGuessCorrect', 'colorGuessIncorrect', 'checkSolution', 'playerWinsRound', 'playerLoosesRound', 'playerWinsRoundFinalRound', 'playerLoosesRoundFinalRound', 'gameOver']}>
          <p>round: {this.props.round} /12</p>
          <p>attempt: {this.props.attempt} /6</p>
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
            start game
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















