import React from 'react';
import './App.css';
import { Action, withStateMachine, State } from 'react-automata'
// import ColorBubbleTray from './ColorBubbleTray'
import Header from './Header';
import Footer from './Footer';
import colorRounds from './ColorRoundsArray';
import GameField from './GameField';
import ColorBubbleTray from './ColorBubbleTray';
// Howler manages the sound effects
import {Howl} from 'howler';



// ==============================
// React Automata State Chart
// States, TRANSITIONS, Functions
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
    roundFinal: {
      onEntry: 'roundFinal',
      on: {
        INCREMENT_ROUND_COUNTER: 'incrementRoundCounter',
      },
    },
    incrementRoundCounter: {
      onEntry: 'incrementRoundCounter',
      on: {
        GO_TO_ATTEMPT_N: 'attemptN',
        NO_MORE_ROUNDS: 'gameOver',
      },
    },
    attemptN: {
      onEntry: 'attemptN',
      on: {
        SELECT_COLOR: 'checkColor',
        OUT_OF_ATTEMPTS: 'playerLoosesRound',
      },
    },
    checkColor: {
      onEntry: 'checkColor',
      on: {
        CORRECT_COLOR_GUESS: 'colorGuessCorrect',
        INCORRECT_COLOR_GUESS: 'colorGuessIncorrect',
      },
    },
    colorGuessCorrect: {
      onEntry: 'colorGuessCorrect',
      on: {
        CORRECT_GUESS_FEEDBACK: 'checkSolution',
      },
    },
    colorGuessIncorrect: {
      onEntry: 'colorGuessIncorrect',
      on: {
        INCORRECT_GUESS_FEEDBACK: 'checkSolution',
      },
    },
    checkSolution: {
      onEntry: 'checkSolution',
      on: {
        CORRECT_SOLUTION: 'playerWinsRound',
        INCORRECT_SOLUTION: 'attemptN',
        CORRECT_SOLUTION_NO_MORE_ROUNDS: 'playerWinsRoundFinalRound',
        INCORRECT_SOLUTION_NO_MORE_ROUNDS: 'playerLoosesRoundFinalRound',
      },
    },
    playerWinsRound: {
      onEntry: 'playerWinsRound',
      on: {
        NEXT_ROUND: 'roundN',
      },
    },
    playerLoosesRound: {
      onEntry: 'playerLoosesRound',
      on: {
        NEXT_ROUND: 'roundN'
      },
    },
    playerWinsRoundFinalRound: {
      onEntry: 'playerWinsRound',
      on: {
        NO_MORE_ROUNDS: 'gameOver'
      },
    },
    playerLoosesRoundFinalRound: {
      onEntry: 'playerLoosesRound',
      on: {
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
  }
}

let maxRoundCount = 3
let maxAttemptCount = 6
let allStateMachineStates = ['homeScreenPractice', 'roundN', 'roundFinal', 'incrementRoundCounter', 'attemptN', 'checkColor', 'colorGuessCorrect', 'colorGuessIncorrect', 'checkSolution', 'playerWinsRound', 'playerLoosesRound', 'playerWinsRoundFinalRound', 'playerLoosesRoundFinalRound', 'gameOver'];


class App extends React.Component {
  constructor(props) {
  super(props);

  this.state = {
    round: 0,
    attempt: 0,
    colorRound: colorRounds[0],
    currentField: 'leftField',
    currentFieldHover: 'leftField',
    leftField: {'backgroundColor': null},
    rightField: {'backgroundColor': null}
  };

  // This binding is necessary to make `this` work in the callback
  this.updateFieldColor = this.updateFieldColor.bind(this)
}



//  =================================
//  State Machine Funcitons
//  =================================
 readyAction = () => {
  this.props.transition('READY')
}



roundN(){
  console.log("Clearing attempts for new round")
  this.props.transition('INCREMENT_ROUND_COUNTER')
  this.setState({attempt: 0})
}

incrementRoundCounter() {
  if (this.state.round >= maxRoundCount) {
    this.props.transition("NO_MORE_ROUNDS")
  } else {
    this.setState({round: (this.state.round + 1)})
    this.setState({colorRound: (colorRounds[this.state.round + 1])})
    this.setState({"leftField": {'backgroundColor': null}})
    this.setState({"rightField": {'backgroundColor': null}})
    console.log("Increment Round by one")
    this.props.transition("GO_TO_ATTEMPT_N")
  }
}

attemptN() {
  if (this.state.attempt < 6) {
    console.log("attemptN()")
    this.props.transition("CHECK_COLOR")
  } else if (this.state.attempt >= 6) {
    console.log("OUT_OF_ATTEMPTS")
    this.props.transition("OUT_OF_ATTEMPTS")
  }
}


checkColor() {

  let leftFieldBackgroundColor = this.state.leftField.backgroundColor;
  let rightFieldBackgroundColor = this.state.rightField.backgroundColor;
  let solutionColor1 = this.state.colorRound.solutionColor1;
  let solutionColor2 = this.state.colorRound.solutionColor2;

  // Correct guess
  if (   (leftFieldBackgroundColor !== rightFieldBackgroundColor) &&
        ((leftFieldBackgroundColor === solutionColor1) || (leftFieldBackgroundColor === solutionColor2)) ||
        ((rightFieldBackgroundColor === solutionColor1) || (rightFieldBackgroundColor === solutionColor2)) )
  {
    this.setState({attempt: (this.state.attempt + 1)})
    this.props.transition("CORRECT_COLOR_GUESS")
    console.log("CORRECT_COLOR_GUESS. Guess: ", leftFieldBackgroundColor, rightFieldBackgroundColor, "Solution: ", solutionColor1, solutionColor2)
  }
  // Incorrect color guess, only one turn
  else if ( (leftFieldBackgroundColor !== solutionColor1) ||
       (leftFieldBackgroundColor !== solutionColor2) ||
       (rightFieldBackgroundColor !== solutionColor1) ||
       (rightFieldBackgroundColor !== solutionColor2) )
    {
      this.setState({attempt: (this.state.attempt + 1)})
      this.props.transition("INCORRECT_COLOR_GUESS")
      console.log("INCORRECT_COLOR_GUESS. Guess: ", leftFieldBackgroundColor, rightFieldBackgroundColor, "Solution: ", solutionColor1, solutionColor2)

    }
  // Incorrect color guess
  else if ( (leftFieldBackgroundColor !== solutionColor1) ||
       (leftFieldBackgroundColor !== solutionColor2) ||
       (rightFieldBackgroundColor !== solutionColor1) ||
       (rightFieldBackgroundColor !== solutionColor2) )
    {
      this.setState({attempt: (this.state.attempt + 1)})
      this.props.transition("INCORRECT_COLOR_GUESS")
      console.log("INCORRECT_COLOR_GUESS. Guess: ", leftFieldBackgroundColor, rightFieldBackgroundColor, "Solution: ", solutionColor1, solutionColor2)

    }
}



colorGuessCorrect() {
  console.log("CORRECT_GUESS_FEEDBACK")
  this.props.transition("CORRECT_GUESS_FEEDBACK")
 }

colorGuessIncorrect() {
  console.log("INCORRECT_GUESS_FEEDBACK - moving to checkSolution")
  this.props.transition("INCORRECT_GUESS_FEEDBACK")
 }


checkSolution() {

  let leftFieldBackgroundColor = this.state.leftField.backgroundColor;
  let rightFieldBackgroundColor = this.state.rightField.backgroundColor;
  let solutionColor1 = this.state.colorRound.solutionColor1;
  let solutionColor2 = this.state.colorRound.solutionColor2;


  if (this.state.attempt <= 1) {
    console.log("There has only been one guess. There can't be a solution.")
    this.props.transition("INCORRECT_SOLUTION")
  } else if (   (leftFieldBackgroundColor !== rightFieldBackgroundColor) &&
        ((leftFieldBackgroundColor === solutionColor1) || (leftFieldBackgroundColor === solutionColor2)) &&
        ((rightFieldBackgroundColor === solutionColor1) || (rightFieldBackgroundColor === solutionColor2))
     )
  {
    console.log("CORRECT_SOLUTION")
    this.props.transition("CORRECT_SOLUTION")
    this.playWinSound();
  } else if (  (this.state.attempt > 1) &&
    ((leftFieldBackgroundColor !== solutionColor1) ||
    (leftFieldBackgroundColor !== solutionColor2)) &&
    ((rightFieldBackgroundColor !== solutionColor1) ||
    (rightFieldBackgroundColor !== solutionColor2))
    ) {
        this.props.transition("INCORRECT_SOLUTION")
      }


 }





playerWinsRound() {
  if (this.state.round < maxRoundCount) {
    console.log("player wins round")
    // commented out b/c currently this action is happening within the button click
    // this.props.transition('NEXT_ROUND')
  }
}

playerLoosesRound() {
  if (this.state.round < maxRoundCount) {
   console.log("player looses round")
   // commented out b/c currently this action is happening within the button click
   // this.props.transition('NEXT_ROUND')
 }
}

playerWinsRoundFinalRound() {
  console.log("player wins final round")
  this.props.transition("NO_MORE_ROUNDS")
}

playerLoosesRoundFinalRound() {
  console.log("player looses final round")
  this.props.transition("NO_MORE_ROUNDS")
}

gameOver() {
  console.log("game over")
  this.setState({attempt: 0})
  this.setState({round: 0})
}
// ***********************************


//  ====================================
//  Toggling between the left and right fields, to determine which
//  one will get filled in with color.
//  =====================================
toggleLeftRightField = () => {
  if (this.state.currentField === "leftField") {
    this.setState({'currentField': "rightField"})
    this.setState({'currentFieldHover': "rightField"})
  } else {
    this.setState({'currentField': "leftField"})
    this.setState({'currentFieldHover': "leftField"})
  }
}



//  ==================================================================
//  Click handler for the color bubbles at bottom of screen
//  ==================================================================
 bubbleClickHandler = (event) =>  {
  // The first lines below are guard clauses. They turns off the click
  // handler so that nothing happens if bubbles are clicked after the round
  // is over or the game is over.
  // if (this.state.isWinningSolution === true) {return}

  this.bubbleSound();
  this.props.transition('SELECT_COLOR');
  this.toggleLeftRightField();
  // The "event" is the click on a specific color bubble. The "currentTarget"
  // is whatever color bubble is clicked. The style.backgroundColor takes
  // whatever background color the clicked color bubble has, and applies that to
  // the color field in questions
  this.updateFieldColor(event.currentTarget.style.backgroundColor);
  // this.isOutOfPicksShowSolution();
};


//  ==================================================================
//  Filling in chosen color into left or right fields,
//  then checking if winning solution (as a callback function)
//  ==================================================================
updateFieldColor(color){
  if (this.state.currentField === 'leftField') {
    // console.log( this.state.currentField, this.color)
   this.setState({"leftField": {'backgroundColor': color}},
    // this.checkWinningSolution
    )
  } else {
    this.setState({"rightField": {'backgroundColor': color}},
      // this.checkWinningSolution
      )
  }
};

//  ===========================
//  Sound/audio that bubbles make upon clicking.
//  There are two distinct sounds. One for the left, one for the right.
//  ===========================
 bubbleSound(){
  // Using the Howler npm package for sound
  // a guard clause if the player has toggled sound to be off
  if (this.state.isAudioOn === false) {return}
    // a different sound if left or right field is active
    if (this.state.currentField === "leftField") {
      const sound = new Howl({
      src: ['/sound/moogy73_perc14.wav']});
      sound.play()

    } else if (this.state.currentField === "rightField") {
      const sound = new Howl({
      src: ['/sound/moogy73_perc15.wav']});
      sound.play()
    }
 };

playWinSound(){
  // a guard clause if the player has toggled sound to be off
  if (this.state.isAudioOn === false) {return}
  const sound = new Howl({
    src: ['/sound/success.wav']
  });
  sound.play()
};

playLoseSound(){
  // a guard clause if the player has toggled sound to be off
  if (this.state.isAudioOn === false) {return}
  const sound = new Howl({
    src: ['/sound/descending.wav']
  });
  sound.play()
};

gameOverChimes() {
    // A guard clause if the user has clicked the audio off
  if (this.state.isAudioOn === false) {return}
  const sound = new Howl({
    src: ['/sound/windchimes.mp3']
  });
  sound.play()
};




  handleClick = () => {
    this.props.transition('READY')
  }


  render() {
    return (
      <div className="twohue">

        <p>
         machineState: {(this.props.machineState.value)}
        </p>

        <Header/>

        <hr/>

        <State is={['homeScreenPractice']}>
          <p>Welcome to twohue, a color mixing game. Practice clicking bubbles before starting.</p>
        </State>

        <State is={['attemptN']}>
          <p>Select a color</p>
        </State>

        <State is={['attemptFinal']}>
          <p>One last guess remaining</p>
        </State>

        <State is={['colorGuessIncorrect']}>
          <p>Incorrect guess</p>
        </State>

        <State is={['gameOver']}>
          <p>game over</p>
        </State>

        <State is={['roundN', 'roundFinal', 'incrementRoundCounter', 'attemptN', 'checkColor', 'colorGuessCorrect', 'colorGuessIncorrect', 'checkSolution', 'playerWinsRound', 'playerLoosesRound', 'playerWinsRoundFinalRound', 'playerLoosesRoundFinalRound', 'gameOver']}>
          <p>round: {this.state.round} /12</p>
          <p>attempt: {this.state.attempt} /6</p>
        </State>

        <State is={['playerWinsRound', 'playerLoosesRound']}>
          <button onClick={ () => {
            this.props.transition('NEXT_ROUND')
            console.log('NEXT_ROUND')
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

        <State is={['gameOver']}>
          <button onClick={ () => {
            this.props.transition('PLAY_AGAIN')
          }}>
            PLAY_AGAIN
          </button>
        </State>

        <State is={['gameOver']}>
          <button onClick={ () => {
            this.props.transition('DONT_PLAY_AGAIN')
          }}>
            DONT_PLAY_AGAIN
          </button>
        </State>

        <State is="homeScreenPractice">practice round</State>

        <State is="loading">SPINNER</State>

          <div id="game-field">

            <GameField colorRound={this.state.colorRound}
                       currentField={this.state.currentField}
                       leftField={this.state.leftField}
                       rightField={this.state.rightField}
                       />


            <ColorBubbleTray colorRound={this.state.colorRound}
                             transition={this.props.transition}
                             updateFieldColor={this.updateFieldColor}
                             currentField={this.state.currentField}
                             leftField={this.state.leftField}
                             rightField={this.state.rightField}
                             bubbleClickHandler={this.bubbleClickHandler}
                             />

         </div>

         <Footer/>

      </div>
    )
  }
}

export default withStateMachine(statechart)(App)

