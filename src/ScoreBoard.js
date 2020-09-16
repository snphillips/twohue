import React, { Component } from 'react';
import { State } from 'react-automata';
import CountUp, { useCountUp } from 'react-countup';


let previousScore = 0
// let score = this.props.score


export default class ScoreBoard extends Component {
  render() {
    return (





      <section className="score-board">

        <State is={['homeScreenPractice']}>
          <button onClick={ () => {
            this.props.startGameClickHandler()
            // this.this.props.transition('START_GAME')
          }}>
            start
          </button>
        </State>


        <State is={['roundN', 'roundFinal', 'incrementRoundCounter', 'attemptN', 'checkColor', 'colorGuessCorrect', 'colorGuessIncorrect', 'checkSolution', 'playerWinsRound', 'playerLoosesRound', 'showSolution', 'playerWinsRoundFinalRound', 'playerLoosesRoundFinalRound', 'gameOver']}>
          <p className="score">score:&nbsp;
            <CountUp
              start={previousScore}
              end={this.props.score}
              // startOnMount={false}
              // redraw={false}
              // preserveValue={true}
              onEnd={() => {
                previousScore = this.props.score
                console.log('CountUp Ended! 👏 score:', this.props.score, 'previousScore:', previousScore)
                }}

              onStart={() => {
                console.log('CountUp Started! 💨 score:', this.props.score, 'previousScore:', this.props.previousScore)
              }}
              // onEnd={({ pauseResume, reset, start, update }) => reset()}
              // onpauseResume={({ pauseResume, reset, start, update }) => void}
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
};






 //       <State is={['roundN', 'roundFinal', 'incrementRoundCounter', 'attemptN', 'checkColor', 'colorGuessCorrect', 'colorGuessIncorrect', 'checkSolution', 'playerWinsRound', 'playerLoosesRound', 'showSolution', 'playerWinsRoundFinalRound', 'playerLoosesRoundFinalRound', 'gameOver']}>
 //         <p className="score">score: {this.this.props.score}</p>
 //       </State>








