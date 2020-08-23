import React, { Component } from 'react';
import MessageBoard from './MessageBoard';
import ScoreBoard from './ScoreBoard';

export default class Header extends Component {
  render() {
    return (

  <header>

    <section>
      <h1 className="app-title">twohue</h1>
    </section>

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
