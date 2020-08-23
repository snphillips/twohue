import React, { Component } from 'react';
import { Action, withStateMachine, State } from 'react-automata'





export default class ScoreBoard extends Component {
  render() {
    return (

      <section className="score-board">

        <State is={['roundN', 'roundFinal', 'incrementRoundCounter', 'attemptN', 'checkColor', 'colorGuessCorrect', 'colorGuessIncorrect', 'checkSolution', 'playerWinsRound', 'playerLoosesRound', 'showSolution', 'playerWinsRoundFinalRound', 'playerLoosesRoundFinalRound']}>
          <p>round: {this.props.round}/12</p>
          <p>attempt: {this.props.attempt}/6</p>
        </State>

        <State is={['roundN', 'roundFinal', 'incrementRoundCounter', 'attemptN', 'checkColor', 'colorGuessCorrect', 'colorGuessIncorrect', 'checkSolution', 'playerWinsRound', 'playerLoosesRound', 'showSolution', 'playerWinsRoundFinalRound', 'playerLoosesRoundFinalRound', 'gameOver']}>
          <p>score: {this.props.score}/12</p>
        </State>

      </section>

    );
  }
}















