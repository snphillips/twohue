import React, { Component } from 'react';


// ==============================
// The set of six 'color bubbles' at the bottom on the game field
// ==============================




export default class ColorBubbleTray extends Component {
  render() {

    return (

      <section id="color-bubble-tray">

        <div
          className="bubble"
          id="bubble00"
          style={{'backgroundColor': this.props.allColorBubbles[0]}}
          onMouseEnter={this.props.currentFieldMouseEnter}
          onMouseLeave={this.props.currentFieldMouseLeave}
          onClick={ (event) => {
            this.props.bubbleClickHandler(event)
          }}
            >
            &nbsp;
        </div>

        <div
          className="bubble"
          id="bubble01"
          style={{'backgroundColor': this.props.allColorBubbles[1]}}
          onMouseEnter={this.props.currentFieldMouseEnter}
          onMouseLeave={this.props.currentFieldMouseLeave}
          onClick={ (event) => {
            this.props.bubbleClickHandler(event)
          }}>
            &nbsp;
        </div>

        <div
          className="bubble"
          id="bubble02"
          style={{'backgroundColor': this.props.allColorBubbles[2]}}
          onMouseEnter={this.props.currentFieldMouseEnter}
          onMouseLeave={this.props.currentFieldMouseLeave}
          onClick={ (event) => {
            this.props.bubbleClickHandler(event)
          }}>
            &nbsp;
        </div>

        <div
          className="bubble"
          id="bubble03"
          style={{'backgroundColor': this.props.allColorBubbles[3]}}
          onMouseEnter={this.props.currentFieldMouseEnter}
          onMouseLeave={this.props.currentFieldMouseLeave}
          onClick={ (event) => {
            this.props.bubbleClickHandler(event)
          }}>
            &nbsp;
        </div>

        <div
          className="bubble"
          id="bubble04"
          style={{'backgroundColor': this.props.allColorBubbles[4]}}
          onMouseEnter={this.props.currentFieldMouseEnter}
          onMouseLeave={this.props.currentFieldMouseLeave}
          onClick={ (event) => {
            this.props.bubbleClickHandler(event)
          }}>
            &nbsp;
        </div>

        <div
          className="bubble"
          id="bubble05"
          style={{'backgroundColor': this.props.allColorBubbles[5]}}
          onMouseEnter={this.props.currentFieldMouseEnter}
          onMouseLeave={this.props.currentFieldMouseLeave}
          onClick={ (event) => {
            this.props.bubbleClickHandler(event)
          }}>
            &nbsp;
        </div>


    </section>


    );
  }
}
