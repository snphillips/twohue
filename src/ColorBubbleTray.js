import React, { Component } from 'react';
// import colorRounds from './ColorRoundsArray';



export default class ColorBubbleTray extends Component {
  render() {
    return (

      <section id="color-bubble-tray">

        <div className="bubble"
             id="bubble00"
             style={{'backgroundColor': this.props.colorRound.allColorBubbles[0]}}
             onMouseEnter={this.props.currentFieldMouseEnter}
             onMouseLeave={this.props.currentFieldMouseLeave}
             onClick={ (event) => {
              this.props.bubbleClickHandler(event)
            }}>
            &nbsp;
        </div>

        <div className="bubble"
             id="bubble01"
             style={{'backgroundColor': this.props.colorRound.allColorBubbles[1]}}
             onClick={ (event) => {
              this.props.bubbleClickHandler(event)
            }}>
            &nbsp;
        </div>

        <div className="bubble"
             id="bubble02"
             style={{'backgroundColor': this.props.colorRound.allColorBubbles[2]}}
             onClick={ (event) => {
              this.props.bubbleClickHandler(event)
            }}>
            &nbsp;
        </div>

        <div className="bubble"
             id="bubble03"
             style={{'backgroundColor': this.props.colorRound.allColorBubbles[3]}}
             onClick={ (event) => {
              this.props.bubbleClickHandler(event)
            }}>
            &nbsp;
        </div>

        <div className="bubble"
             id="bubble04"
             style={{'backgroundColor': this.props.colorRound.allColorBubbles[4]}}
             onClick={ (event) => {
              this.props.bubbleClickHandler(event)
            }}>
            &nbsp;
        </div>

        <div className="bubble"
             id="bubble05"
             style={{'backgroundColor': this.props.colorRound.allColorBubbles[5]}}
             onClick={ (event) => {
              this.props.bubbleClickHandler(event)
            }}>
            &nbsp;
        </div>


    </section>


    );
  }
}
