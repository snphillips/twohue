import React, { Component } from 'react';


export default class GameField extends Component {
  render() {
    return (

  <div>
    <div className="target-swatch" style={{'backgroundColor': this.props.colorRound.targetColor}} >&nbsp;</div>
    <div className={ `left-field ${this.props.leftField.className}`} style={this.props.leftField}>&nbsp;</div>
    <div className={ `right-field ${this.props.rightField.className}`} style={this.props.rightField}>&nbsp;</div>
  </div>

    );
  }
}
