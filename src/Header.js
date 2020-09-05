import React, { Component } from 'react';
import MessageBoard from './MessageBoard';
import ScoreBoard from './ScoreBoard';
import Title from './Title';



export default class Header extends Component {
  render() {
    return (

  <header>

    <Title />

    <MessageBoard
      transition={this.props.transition}
      resetScore={this.props.resetScore}
      />

    <ScoreBoard
      round={this.props.round}
      maxRoundCount={this.props.maxRoundCount}
      attempt={this.props.attempt}
      score={this.props.score}
      transition={this.props.transition}
      isAudioOn={this.props.isAudioOn}
      beginGameSound={this.props.beginGameSound}
      startGameClickHandler={this.props.startGameClickHandler}
      />

  </header>

    );
  }
}
