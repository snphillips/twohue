import React, { Component } from 'react';


export default class GameField extends Component {
  render() {
    return (

  <div>
    <div id="target-swatch"
         className=""
         style={{'backgroundColor': this.props.colorRound.targetColor}} >
         &nbsp;
      <span className="tooltiptext">target color</span>
    </div>

    <section id="left-and-right-field">

      <div className="field"
           id="left-field"
           style={this.props.leftField}
           >&nbsp;
      </div>

      <div className="field"
           id="right-field"
           style={this.props.rightField}
           >&nbsp;
      </div>
    </section>

  </div>

    );
  }
}
