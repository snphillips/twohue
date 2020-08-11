import React from 'react';
import './App.css';
import { Action, withStateMachine, State } from 'react-automata'
// import ColorBubbleTray from './ColorBubbleTray'



// ==============================
// React Automata State Chart
// ==============================
const statechart = {
  initial: 'loading',
  states: {
    loading: {
      onEntry: 'readyAction',
      on: {
        READY: 'homeScreenPractice',
      },
    },
    homeScreenPractice: {
      onEntry: 'updateMessage',
      on: {
        SELECT_COLOR: 'homeScreenPractice',
        START_GAME: 'roundCount0',
      },
    },
    roundCount0: {
      onEntry: 'roundCount0',
      on: {
        SELECT_COLOR: 'attemptCount0',
      },
    },
    roundCountN: {
      onEntry: 'roundCountN',
      on: {
        FINISHED_GAME: 'roundFinal',
        UNFINISHED_GAME: 'attemptCountN',
      },
    },
    roundFinal: {
      onEntry: 'sayCiao',
      on: {
        CLOSE_GAME: 'homeScreenPractice',
        PLAY_AGAIN:'roundCount0',
      },
    },
    attemptCount0: {
      onEntry: 'rightOrWrong',
      on: {
        SELECT_COLOR: 'checkColor',
      },
    },
    attemptCountN: {
      onEntry: 'attemptCountN',
      on: {
        SELECT_COLOR: 'checkColor',
        FINAL_INCORRECT_GUESS: 'attemptFinal',

      },
    },
    checkColor: {
      onEntry: 'checkColor',
      on: {
        CORRECT_GUESS: 'roundCountN',
        INCORRECT_GUESS: 'attemptCountN',
      },
    },
    attemptFinal: {
      onEntry: 'sayCiao',
      on: {
        CONTINUE: 'roundCountN',
      },
    },
  },
}





const maxRoundCount = 10
const maxPlayerPickCount = 6






class App extends React.Component {
  constructor(props) {
  super(props);

  this.state = {
    roundCount: 0,
    attemptCount: 0,


  };

  // This binding is necessary to make `this` work in the callback

}

 readyAction = () => { this.props.transition('READY') }


roundCount0 = ()=>{
  this.setState({roundCount: (this.state.roundCount + 1)})
}


roundCountN = ()=>{
  if (this.state.roundCount >= 10){
    this.props.transition("FINISHED_GAME")
  }else{

    this.setState({roundCount: (this.state.roundCount + 1)})
    this.props.transition("UNFINISHED_GAME")
  }
}

attemptCountN = ()=>{
this.setState({attemptCount: (this.state.attemptCount + 1)})

  if (this.state.attemptCount >= 5){
    this.props.transition("FINAL_INCORRECT_GUESS")
  }
}


checkColor = () => {
    this.props.transition("INCORRECT_GUESS")

}




  handleClick = () => {
    this.props.transition('READY')
  }

  render() {
    return (
      <div>
        <p>

       {(this.props.machineState.value)}
        </p>

        <State is={['homeScreenPractice']}>
          <p>Welcome to twohue, a color mixing game. Practice clicking bubbles before starting.</p>
        </State>

        <State is={['roundCount0']}>
          <p>Choose a color.</p>
        </State>

        <State is={['roundCountN']}>
          <p>Choose a different color.</p>
        </State>

        <State is={['roundCountFinal']}>
          <p>Choose final.</p>
        </State>


        <State is={['homeScreenPractice']}>
          <button onClick={ () => {
            this.props.transition('START_GAME')
          }}>
            START_GAME
          </button>
        </State>

        <State is="homeScreenPractice">practice round</State>

        <State is="loading">SPINNER</State>

        <State is="roundCount0">game play</State>

        <p>roundCount: {this.state.roundCount}</p>
        <p>playerPickCount: {this.state.attemptCount}</p>

        <div id="color-bubble-tray">
          <span className="bubble" id="bubble00" onClick={ () => {
              this.props.transition('SELECT_COLOR')

            }}>&nbsp;</span>
          <span className="bubble" id="bubble01" onClick={ () => {
              this.props.transition('SELECT_COLOR')

            }}>&nbsp;</span>
          <span className="bubble" id="bubble02" onClick={ () => {
              this.props.transition('SELECT_COLOR')

            }}>&nbsp;</span>
          <span className="bubble" id="bubble03" onClick={ () => {
              this.props.transition('SELECT_COLOR')

            }}>&nbsp;</span>
          <span className="bubble" id="bubble04" onClick={ () => {
              this.props.transition('SELECT_COLOR')

            }}>&nbsp;</span>
          <span className="bubble" id="bubble05" onClick={ () => {
              this.props.transition('SELECT_COLOR')

            }}>&nbsp;</span>
      </div>

      </div>
    )
  }
}

export default withStateMachine(statechart)(App)

