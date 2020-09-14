import React, { Component } from 'react';
import { State } from 'react-automata';
import CountUp from 'react-countup';






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
          <p className="score">score:&nbsp;
            <CountUp
              end={this.props.score}
              duration={2}
            />
          </p>
        </State>

        <State is={['roundN', 'roundFinal', 'incrementRoundCounter', 'attemptN', 'checkColor', 'colorGuessCorrect', 'colorGuessIncorrect', 'checkSolution', 'playerWinsRound', 'playerLoosesRound', 'showSolution', 'playerWinsRoundFinalRound', 'playerLoosesRoundFinalRound']}>
          <p>attempt: {this.props.attempt}/6</p>
        </State>

        <State is={['roundN', 'roundFinal', 'incrementRoundCounter', 'attemptN', 'checkColor', 'colorGuessCorrect', 'colorGuessIncorrect', 'checkSolution', 'playerWinsRound', 'playerLoosesRound', 'showSolution', 'playerWinsRoundFinalRound', 'playerLoosesRoundFinalRound']}>
          <p className="loses">flops: {this.props.looseRound}/{this.props.maxLossCount}</p>
        </State>

      </section>

    );
  }
}






 //       <State is={['roundN', 'roundFinal', 'incrementRoundCounter', 'attemptN', 'checkColor', 'colorGuessCorrect', 'colorGuessIncorrect', 'checkSolution', 'playerWinsRound', 'playerLoosesRound', 'showSolution', 'playerWinsRoundFinalRound', 'playerLoosesRoundFinalRound', 'gameOver']}>
 //         <p className="score">score: {this.props.score}</p>
 //       </State>








