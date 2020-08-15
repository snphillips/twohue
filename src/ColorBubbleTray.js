
import React, { Component } from 'react';

export default class ColorBubbleTray extends Component {
  render() {
    return (

      <section id="color-bubble-tray">

        <div className="bubble" id="bubble00" onClick={ () => {
            this.props.transition('SELECT_COLOR')

          }}>&nbsp;</div>
        <div className="bubble" id="bubble01" onClick={ () => {
            this.props.transition('SELECT_COLOR')

          }}>&nbsp;</div>
        <div className="bubble" id="bubble02" onClick={ () => {
            this.props.transition('SELECT_COLOR')

          }}>&nbsp;</div>
        <div className="bubble" id="bubble03" onClick={ () => {
            this.props.transition('SELECT_COLOR')

          }}>&nbsp;</div>
        <div className="bubble" id="bubble04" onClick={ () => {
            this.props.transition('SELECT_COLOR')

          }}>&nbsp;</div>
        <div className="bubble" id="bubble05" onClick={ () => {
            this.props.transition('SELECT_COLOR')

          }}>&nbsp;</div>

    </section>


    );
  }
}
