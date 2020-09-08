import React, { Component } from 'react';
import { State } from 'react-automata';

export default class Title extends Component {
  render() {
    return (


    <section className="title-and-round-section">

      <h1>twohue</h1>

      <State is={['roundN', 'roundFinal', 'incrementRoundCounter', 'attemptN', 'checkColor', 'colorGuessCorrect', 'colorGuessIncorrect', 'checkSolution', 'playerWinsRound', 'playerLoosesRound', 'showSolution', 'playerWinsRoundFinalRound', 'playerLoosesRoundFinalRound']}>
        <p className="round-readout">round: {this.props.round}</p>
      </State>


    </section>


    );
  }
}
