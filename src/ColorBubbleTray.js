import React, { Component } from 'react';
// import colorRounds from './ColorRoundsArray';


  // This helps shuffles the order of the color bubbles
  // shuffling an array of 0-5, then using
  // those numbers
  let arr = [0, 1, 2, 3, 4, 5];
  function shuffle(array) {
    array.sort(() => Math.random() - 0.5);
  }
  shuffle(arr);



export default class ColorBubbleTray extends Component {
  render() {




    return (

      <section id="color-bubble-tray">

        <div className="bubble"
             id="bubble00"
             style={{'backgroundColor': this.props.colorRound.allColorBubbles[arr[0]]}}
             onMouseEnter={this.props.currentFieldMouseEnter}
             onMouseLeave={this.props.currentFieldMouseLeave}
             onClick={ (event) => {
              this.props.bubbleClickHandler(event)
            }}>
            &nbsp;
        </div>

        <div className="bubble"
             id="bubble01"
             style={{'backgroundColor': this.props.colorRound.allColorBubbles[arr[1]]}}
             onMouseEnter={this.props.currentFieldMouseEnter}
             onMouseLeave={this.props.currentFieldMouseLeave}
             onClick={ (event) => {
              this.props.bubbleClickHandler(event)
            }}>
            &nbsp;
        </div>

        <div className="bubble"
             id="bubble02"
             style={{'backgroundColor': this.props.colorRound.allColorBubbles[arr[2]]}}
             onMouseEnter={this.props.currentFieldMouseEnter}
             onMouseLeave={this.props.currentFieldMouseLeave}
             onClick={ (event) => {
              this.props.bubbleClickHandler(event)
            }}>
            &nbsp;
        </div>

        <div className="bubble"
             id="bubble03"
             style={{'backgroundColor': this.props.colorRound.allColorBubbles[arr[3]]}}
             onClick={ (event) => {
              this.props.bubbleClickHandler(event)
            }}>
            &nbsp;
        </div>

        <div className="bubble"
             id="bubble04"
             style={{'backgroundColor': this.props.colorRound.allColorBubbles[arr[4]]}}
             onClick={ (event) => {
              this.props.bubbleClickHandler(event)
            }}>
            &nbsp;
        </div>

        <div className="bubble"
             id="bubble05"
             style={{'backgroundColor': this.props.colorRound.allColorBubbles[arr[5]]}}
             onClick={ (event) => {
              this.props.bubbleClickHandler(event)
            }}>
            &nbsp;
        </div>


    </section>


    );
  }
}
