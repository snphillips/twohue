import React, { Component } from 'react';


export default class AudioToggle extends Component {
  render() {
    return (

      <button className="audio-button"
              onClick={this.props.muteButtonToggle}>
                {this.props.isAudioOn ? 'audio on' : 'audio off'}
      </button>
    );
  }
}


