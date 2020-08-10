import React from 'react';
import './App.css';
import { Action, withStateMachine, State } from 'react-automata'


const statechart = {
  initial: 'loading',
  states: {
    loading: {
      on: {
        READY: 'practice',
      },
      onEntry: 'readyAction',
    },
    practice: {
      on: {
        SELECT_COLOR: 'practice',
        START_GAME: 'round0',
      },
      onEntry: 'sayCiao',
    },
    round0: {
      on: {
        SELECT_COLOR: 'roundN',
      },
      onEntry: 'sayCiao',
    },
    attempt0: {
      on: {
        SELECT_COLOR: 'roundN',
      },
      onEntry: 'sayCiao',
    },
    roundN: {
      on: {
        UNFINISHED_GAME: 'attemptN',
        FINISHED_GAME: 'roundsComplete',
      },
      onEntry: 'sayCiao',
    },
    attemptN: {
      on: {
        UNFINISHED_ATTEMPT: 'attemptN',
        FINISHED_ATTEMPT: 'roundN',
      },
      onEntry: 'sayCiao',
    },
    roundsComplete: {
      on: {
      },
      onEntry: 'sayCiao',
    },
  },
}







const maxRounds = 10
const maxAttempts = 6



class App extends React.Component {
  constructor(props) {
  super(props);

  this.state = {
    round: 0,
    attempt: 0,

  };

  // This binding is necessary to make `this` work in the callback
  // this.handleChange = this.handleChange.bind(this);

}

 readyAction = ()=>{this.props.transition('READY')}
 circle1 = ()=>{this.props.transition('SELECT_COLOR')}
 circle2 = ()=>{this.props.transition('SELECT_COLOR')}


  handleClick = () => {
    this.props.transition('READY')
  }

  render() {
    return (
      <div>
        <button onClick={this.circle1}>circle 1</button>
        <button onClick={this.circle2}>circle 2</button>
        <button onClick={()=>{this.props.transition('START_GAME')}}>START_GAME</button>
        <State is="loading">SPINNER</State>
        <State is="practice">practice</State>
        <State is="round0">game play</State>
      </div>
    )
  }
}

export default withStateMachine(statechart)(App)

