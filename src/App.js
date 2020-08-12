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
        START_GAME: 'roundN',
      },
    },
    roundN: {
      onEntry: 'roundN',
      on: {
        INCREMENT_ROUND_COUNTER: 'incrementRoundCounter',
      },
    },
    incrementRoundCounter: {
      onEntry: 'incrementRoundCounter',
      on: {
        SELECT_COLOR: 'checkColor',
      },
    },
    attemptN: {
      onEntry: 'attemptN',
      on: {
        SELECT_COLOR: 'checkColor',
      },
    },
    checkColor: {
      onEntry: 'checkColor',
      on: {
        CORRECT_GUESS: 'checkSolution',
        INCORRECT_GUESS: 'checkSolution',
      },
    },
    checkSolution: {
      onEntry: 'checkSolution',
      on: {
        CORRECT_SOLUTION: 'playerWinsRound',
        INCORRECT_SOLUTION: 'attemptN',
        INCORRECT_SOLUTION_NO_MORE_ATTEMPTS: 'playerLoosesRound',
      },
    },
    playerWinsRound: {
      onEntry: 'playerWinsRound',
      on: {
        NEXT_ROUND: 'roundN',
        NO_MORE_ROUNDS: 'gameOver'
      },
    },
    playerLoosesRound: {
      onEntry: 'playerLoosesRound',
      on: {
        NEXT_ROUND: 'roundN',
        NO_MORE_ROUNDS: 'gameOver'
      },
    },
    gameOver: {
      onEntry: 'gameOver',
      on: {
        PLAY_AGAIN: 'roundN',
        DONT_PLAY_AGAIN: 'homeScreenPractice',
      }
    }
  },
}



// const maxRound = 10
// const maxPlayerPick = 6



class App extends React.Component {
  constructor(props) {
  super(props);

  this.state = {
    round: 0,
    attempt: 0,


  };

  // This binding is necessary to make `this` work in the callback

}

 readyAction = () => {
  this.props.transition('READY')
  // this.setState({round: (this.state.round + 1)})
}


roundN(){
  console.log("This is roundN()")
  this.props.transition('INCREMENT_ROUND_COUNTER')
}


incrementRoundCounter() {
  if (this.state.round >= 10) {
    this.props.transition("FINISHED_GAME")
  } else {
    this.setState({round: (this.state.round + 1)})
    console.log("Increment Round by one")
    this.props.transition("SELECT_COLOR")
  }
}

attemptN() {
  console.log("attemptN() - user selects color")
  this.props.transition("SELECT_COLOR")
}

checkColor() {
  this.setState({attempt: (this.state.attempt + 1)})
  console.log("this.state.attempt: ", this.state.attempt)
  if (this.state.attempt < 1) {
    this.props.transition("INCORRECT_GUESS")
    console.log("checking color- hard coded INCORRECT_GUESS")
  } else {
    console.log("check color guess - hardcoded correct for now")
    this.props.transition("CORRECT_GUESS")
  }
}

checkSolution() {
  if (this.state.attempt > 1) {
    console.log("check solution - hardcoded correct for now")
    this.props.transition("CORRECT_SOLUTION")
  } else {
    console.log("There has only been one guess. There can't be a solution.")
    this.props.transition("INCORRECT_SOLUTION")
  }
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

        <hr/>

        <State is={['homeScreenPractice']}>
          <p>Welcome to twohue, a color mixing game. Practice clicking bubbles before starting.</p>
        </State>

        <State is={['roundN']}>
          <p>Select a color.</p>
        </State>

        <State is={['roundN']}>
          <p>Select a different color.</p>
        </State>

        <State is={['roundFinal']}>
          <p>Choose final color.</p>
        </State>

        <State is={['attemptN']}>
          <p>Select an other color</p>
        </State>

        <State is={['attemptFinal']}>
          <p>attemptFinal message.</p>
        </State>

        <State is={['playerWinsRound', 'playerLoosesRound']}>
          <button onClick={ () => {
            this.props.transition('INCREMENT_ROUND_COUNTER')
          }}>
            NEXT_ROUND
          </button>
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



        <p>round: {this.state.round}</p>
        <p>attempt: {this.state.attempt}</p>

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

