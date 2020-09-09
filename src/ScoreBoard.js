import React, { Component } from 'react';
import { State } from 'react-automata'





export default class ScoreBoard extends Component {
  render() {
    return (

      <section className="score-board">

        <State is={['homeScreenPractice']}>
          <button onClick={ () => {
            this.props.startGameClickHandler()
            // this.props.transition('START_GAME')
          }}>
            start
          </button>
        </State>


        <State is={['roundN', 'roundFinal', 'incrementRoundCounter', 'attemptN', 'checkColor', 'colorGuessCorrect', 'colorGuessIncorrect', 'checkSolution', 'playerWinsRound', 'playerLoosesRound', 'showSolution', 'playerWinsRoundFinalRound', 'playerLoosesRoundFinalRound', 'gameOver']}>
          <p className="score">score: {this.props.score}</p>
        </State>

        <State is={['roundN', 'roundFinal', 'incrementRoundCounter', 'attemptN', 'checkColor', 'colorGuessCorrect', 'colorGuessIncorrect', 'checkSolution', 'playerWinsRound', 'playerLoosesRound', 'showSolution', 'playerWinsRoundFinalRound', 'playerLoosesRoundFinalRound']}>
          <p>attempt: {this.props.attempt}/6</p>
        </State>

        <State is={['roundN', 'roundFinal', 'incrementRoundCounter', 'attemptN', 'checkColor', 'colorGuessCorrect', 'colorGuessIncorrect', 'checkSolution', 'playerWinsRound', 'playerLoosesRound', 'showSolution', 'playerWinsRoundFinalRound', 'playerLoosesRoundFinalRound', 'gameOver']}>
          <p className="loses">losses: {this.props.looseRound}/{this.props.maxLossCount}</p>
        </State>

      </section>

    );
  }
}


          // <p>round: {this.props.round}</p>
          // <p className="score">score: {this.props.score}/12</p>

          // <p>round: {this.props.round}/{this.props.maxRoundCount}</p>












