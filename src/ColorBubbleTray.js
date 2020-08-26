import React, { Component } from 'react';
import colorRounds from './colorRoundsArray.js'



function shuffle(array) {
  array.sort(() => Math.random() - 0.5);
}

let i;

for (i = 0; i < colorRounds.length; i++) {
  shuffle(colorRounds[i].allColorBubbles);
  console.log("snakejazz colorRounds[i].allColorBubbles index: ", i, colorRounds[i].allColorBubbles)
}






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
             onMouseEnter={this.props.currentFieldMouseEnter}
             onMouseLeave={this.props.currentFieldMouseLeave}
             onClick={ (event) => {
              this.props.bubbleClickHandler(event)
            }}>
            &nbsp;
        </div>

        <div className="bubble"
             id="bubble02"
             style={{'backgroundColor': this.props.colorRound.allColorBubbles[2]}}
             onMouseEnter={this.props.currentFieldMouseEnter}
             onMouseLeave={this.props.currentFieldMouseLeave}
             onClick={ (event) => {
              this.props.bubbleClickHandler(event)
            }}>
            &nbsp;
        </div>

        <div className="bubble"
             id="bubble03"
             style={{'backgroundColor': this.props.colorRound.allColorBubbles[3]}}
             onMouseEnter={this.props.currentFieldMouseEnter}
             onMouseLeave={this.props.currentFieldMouseLeave}
             onClick={ (event) => {
              this.props.bubbleClickHandler(event)
            }}>
            &nbsp;
        </div>

        <div className="bubble"
             id="bubble04"
             style={{'backgroundColor': this.props.colorRound.allColorBubbles[4]}}
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
