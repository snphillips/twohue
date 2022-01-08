import React, { Component } from 'react';
import { State } from 'react-automata';
import CountUp from 'react-countup';


let previousScore = 0

// gotcha: if the duration of the counter is changed,
// the counter may count down then up again.

export default function ScoreBoard(props) {
    return (


      <section className="score-board">

        <State is={['homeScreenPractice']}>
          <button onClick={ () => {
            props.startGameClickHandler()
          }}>
            start
          </button>
        </State>


        <State is={['roundN', 'roundFinal', 'incrementRoundCounter', 'attemptN', 'checkColor', 'colorGuessCorrect', 'colorGuessIncorrect', 'checkSolution', 'playerWinsRound', 'playerLoosesRound', 'showSolution', 'playerWinsRoundFinalRound', 'playerLoosesRoundFinalRound', 'gameOver', 'gameOverTransition', 'joinLeaderboard', 'leaderboard']}>
          <p className="score-word">score:&nbsp;
            <span className="actual-score">
              <CountUp
                start={previousScore}
                end={props.score}
                duration={1.5}
                onEnd={() => {
                  previousScore = props.score
                   // console.log( "Count up done: previousScore:", previousScore, "props.score:", props.score)
                }}
              />
            </span>


          </p>
        </State>

        <State is={['roundN', 'roundFinal', 'incrementRoundCounter', 'attemptN', 'checkColor', 'colorGuessCorrect', 'colorGuessIncorrect', 'checkSolution', 'playerWinsRound', 'playerLoosesRound', 'showSolution', 'playerWinsRoundFinalRound', 'playerLoosesRoundFinalRound']}>
          <p>attempt: {props.attempt}/{props.maxAttemptCount}</p>
        </State>

        <State is={['roundN', 'roundFinal', 'incrementRoundCounter', 'attemptN', 'checkColor', 'colorGuessCorrect', 'colorGuessIncorrect', 'checkSolution', 'playerWinsRound', 'playerLoosesRound', 'showSolution', 'playerWinsRoundFinalRound', 'playerLoosesRoundFinalRound']}>
          <p className="loses">flops: {props.looseRound}/{props.maxLossCount}</p>
        </State>

      </section>

    );
};



