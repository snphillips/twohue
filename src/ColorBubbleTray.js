
import React, { Component } from 'react';

export default class ColorBubbleTray extends Component {
  render() {
    return (

  <div id="color-bubble-tray">

    <span className="bubble" id="bubble00" onClick={this.props.playerMakesAGuess}>&nbsp;</span>
    <span className="bubble" id="bubble01" onClick={this.props.playerMakesAGuess}>&nbsp;</span>
    <span className="bubble" id="bubble02" onClick={this.props.playerMakesAGuess}>&nbsp;</span>
    <span className="bubble" id="bubble03" onClick={this.props.playerMakesAGuess}>&nbsp;</span>
    <span className="bubble" id="bubble04" onClick={this.props.playerMakesAGuess}>&nbsp;</span>
    <span className="bubble" id="bubble05" onClick={this.props.playerMakesAGuess}>&nbsp;</span>



  </div>

    );
  }
}
