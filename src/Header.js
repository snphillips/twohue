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
      />

    <ScoreBoard
      round={this.props.round}
      attempt={this.props.attempt}
      score={this.props.score}
      />

  </header>

    );
  }
}
