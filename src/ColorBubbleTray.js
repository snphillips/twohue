import React, { Component } from 'react';


// This helps shuffles the order of the color bubbles
// shuffling an array of 0-5, then using
// those numbers
// Not working
let colorShuffleArr = [0, 1, 2, 3, 4, 5];
function shuffle(array) {
  array.sort(() => Math.random() - 0.5);
}
shuffle(colorShuffleArr);

export default class ColorBubbleTray extends Component {





  render() {


    return (

      <section id="color-bubble-tray">

        <div className="bubble"
             id="bubble00"
             style={{'backgroundColor': this.props.colorRound.allColorBubbles[colorShuffleArr[0]]}}
             onMouseEnter={this.props.currentFieldMouseEnter}
             onMouseLeave={this.props.currentFieldMouseLeave}
             onClick={ (event) => {
              this.props.bubbleClickHandler(event)
            }}>
            &nbsp;
        </div>

        <div className="bubble"
             id="bubble01"
             style={{'backgroundColor': this.props.colorRound.allColorBubbles[colorShuffleArr[1]]}}
             onMouseEnter={this.props.currentFieldMouseEnter}
             onMouseLeave={this.props.currentFieldMouseLeave}
             onClick={ (event) => {
              this.props.bubbleClickHandler(event)
            }}>
            &nbsp;
        </div>

        <div className="bubble"
             id="bubble02"
             style={{'backgroundColor': this.props.colorRound.allColorBubbles[colorShuffleArr[2]]}}
             onMouseEnter={this.props.currentFieldMouseEnter}
             onMouseLeave={this.props.currentFieldMouseLeave}
             onClick={ (event) => {
              this.props.bubbleClickHandler(event)
            }}>
            &nbsp;
        </div>

        <div className="bubble"
             id="bubble03"
             style={{'backgroundColor': this.props.colorRound.allColorBubbles[colorShuffleArr[3]]}}
             onMouseEnter={this.props.currentFieldMouseEnter}
             onMouseLeave={this.props.currentFieldMouseLeave}
             onClick={ (event) => {
              this.props.bubbleClickHandler(event)
            }}>
            &nbsp;
        </div>

        <div className="bubble"
             id="bubble04"
             style={{'backgroundColor': this.props.colorRound.allColorBubbles[colorShuffleArr[4]]}}
             onMouseEnter={this.props.currentFieldMouseEnter}
             onMouseLeave={this.props.currentFieldMouseLeave}onClick={ (event) => {
              this.props.bubbleClickHandler(event)
            }}>
            &nbsp;
        </div>

        <div className="bubble"
             id="bubble05"
             onMouseEnter={this.props.currentFieldMouseEnter}
             onMouseLeave={this.props.currentFieldMouseLeave}
             style={{'backgroundColor': this.props.colorRound.allColorBubbles[colorShuffleArr[5]]}}
             onClick={ (event) => {
              this.props.bubbleClickHandler(event)
            }}>
            &nbsp;
        </div>


    </section>


    );
  }
}
