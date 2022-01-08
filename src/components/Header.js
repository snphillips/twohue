import React, { Component } from 'react';
import Title from './Title';
import MessageBoard from './MessageBoard';
import ScoreBoard from './ScoreBoard';



export default class Header extends Component {
  render() {
    return (

      <header>

        <Title
          round={this.props.round}
        />

        <MessageBoard
          transition={this.props.transition}
          resetScoreForNextGame={this.props.resetScoreForNextGame}
          />

        <ScoreBoard
          round={this.props.round}
          attempt={this.props.attempt}
          score={this.props.score}
          previousScore={this.props.previousScore}
          looseRound={this.props.looseRound}
          maxLossCount={this.props.maxLossCount}
          maxAttemptCount={this.props.maxAttemptCount}
          transition={this.props.transition}
          isAudioOn={this.props.isAudioOn}
          beginGameSound={this.props.beginGameSound}
          startGameClickHandler={this.props.startGameClickHandler}
          />

      </header>

    );
  }
}
