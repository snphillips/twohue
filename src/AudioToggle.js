import React, { Component } from 'react';


// ==============================
// This is the 'audio on/audio off' button which is
// found in the footer.

// Two things are going on here:

// 1) When the user clicks the button, the sound is turned on
// via the function soundButtonToggle (found in App.js)

// 2) The state 'isAudioOn' is passed in from App.js as a prop.
// If the state of 'isAudioOn' is true, then the button will read 'audio on'
// If the state of 'isAudioOn' is false, then the button will read 'audio off'
// ==============================


export default class AudioToggle extends Component {
  render() {
    return (

      <button
        className="audio-button"
        onClick={this.props.soundButtonToggle}
        >
        {this.props.isAudioOn ? 'audio on' : 'audio off'}
      </button>
    );
  }
}


