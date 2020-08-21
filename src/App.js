import React from 'react';
import './App.css';
import { Action, withStateMachine, State } from 'react-automata'
// import ColorBubbleTray from './ColorBubbleTray'
import Header from './Header';
import MessageBoard from './MessageBoard';
import Byline from './Byline';
import colorRounds from './ColorRoundsArray';
import GameField from './GameField';
import AudioToggle from './AudioToggle';
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
        SHOW_SOLUTION: 'showSolution'
      },
    },
    showSolution: {
      onEntry: 'showSolution',
      on: {
        NEXT_ROUND: 'roundN',
        NO_MORE_ROUNDS: 'gameOver'
      },
    },
    playerWinsRoundFinalRound: {
      onEntry: 'playerWinsRoundFinalRound',
      on: {
        NO_MORE_ROUNDS: 'gameOver'
      },
    },
    playerLoosesRoundFinalRound: {
      onEntry: 'playerLoosesRoundFinalRound',
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
    rightField: {'backgroundColor': null},
    isAudioOn: false,
  };

  // This binding is necessary to make `this` work in the callback
  this.updateFieldColor = this.updateFieldColor.bind(this)
  this.muteButtonToggle = this.muteButtonToggle.bind(this)
  this.currentFieldMouseEnter = this.currentFieldMouseEnter.bind(this)
  this.currentFieldMouseLeave = this.currentFieldMouseLeave.bind(this)
  this.showSolution = this.showSolution.bind(this)
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
   this.props.transition('SHOW_SOLUTION')
 }
}




showSolution() {
  console.log("showSolution")


  this.setState({"leftField": {
    'backgroundColor': this.state.colorRound.solutionColor1,
    'animation': 'fadein 5.0s'
  }});
  this.setState({"rightField": {
    'backgroundColor': this.state.colorRound.solutionColor2,
    'animation': 'fadein 5.0s'
  }});


    let transition = () => {
      this.props.transition('NEXT_ROUND')
    }

    setTimeout(function() {
      console.log("setTimeout 2000")
    //your code to be executed after 2 seconds
    transition()
    }, 2500);



};





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
// *********************************************************************
// *********************************************************************
// *********************************************************************
// *********************************************************************


//  ==================================================================
//  Hover handler for color bubbles - shows player which field of the
//  two fields is currently active. Note: we have to set the backgroundColor
//  otherwise it will revert to none.
//  Leave the commented out lines in for now....we may need them in future.
//  ==================================================================
currentFieldMouseEnter(){
if (this.state.currentField === 'leftField'){
this.setState({'leftField': {
  "border": "8px solid #abb2b9",
  "backgroundColor": "this.color",
}});


  } else {
    this.setState({'rightField':{
      "border": "8px solid #abb2b9",
      "backgroundColor": "this.color",
    }});
  }
};

currentFieldMouseLeave(){
  if (this.state.currentField === 'leftField'){
    this.setState({'leftField': {
      "border": "3px solid #abb2b9",
      "backgroundColor": "this.color"
    }});
  } else {
    this.setState({'rightField':{
      "border": "3px solid #abb2b9",
      "backgroundColor": "this.color"
    }});
  }
};


//  ====================================
//  Toggling between the left and right fields, to determine which
//  one will get filled in with color.
//  ====================================
toggleLeftRightField = () => {
  if (this.state.currentField === "leftField") {
    this.setState({'currentField': "rightField"})
    this.setState({'currentFieldHover': "rightField"})
  } else {
    this.setState({'currentField': "leftField"})
    this.setState({'currentFieldHover': "leftField"})
  }
}


//  ===================================
//  Click handler for the color bubbles at bottom of screen
//  ===================================
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
};


//  ==================================
//  Filling in chosen color into left or right fields,
//  then checking if winning solution (as a callback function)
//  ==================================
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


startSound(){
  // A guard clause if the user has clicked the audio off
  if (this.state.isAudioOn === false) {return}
  const sound = new Howl({
    src: ['/sound/finger-snap.wav']
  });
  sound.play()
};

//  ===========================
//  Sound/audio that bubbles make upon clicking.
//  There are two distinct sounds. One for the left, one for the right.
//  ===========================


//  Mute button toggle, if audio is on,
//  the !(not) turns it off and vice versa
   muteButtonToggle() {
    this.setState(prevState => ({
      isAudioOn: !prevState.isAudioOn
    }));
  }


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

        <p className="machine-state-indicator">
         machineState: {(this.props.machineState.value)}
        </p>

        <Header/>


          <div id="game-field">

        <MessageBoard round={this.state.round}
                      attempt={this.state.attempt}
                      transition={this.props.transition}
                      />

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
                             currentFieldMouseEnter={this.currentFieldMouseEnter}
                             currentFieldMouseLeave={this.currentFieldMouseLeave}
                             bubbleClickHandler={this.bubbleClickHandler}
                             />

         </div>


         <footer>

           <Byline muteButtonToggle={this.muteButtonToggle}
                   isAudioOn={this.state.isAudioOn}
                   />


           <AudioToggle muteButtonToggle={this.muteButtonToggle}
                        isAudioOn={this.state.isAudioOn}
                       />
        </footer>


      </div>
    )
  }
}

export default withStateMachine(statechart)(App)







