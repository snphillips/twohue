import React from 'react';
import { Action, withStateMachine, State } from 'react-automata'
import './App.css';
import Header from './Header';
import Byline from './Byline';
import colorRound from './colorRoundsArray';
import GameField from './GameField';
import AudioToggle from './AudioToggle';
import ColorBubbleTray from './ColorBubbleTray';
// Howler manages the sound effects
import {Howl} from 'howler';
import Confetti from 'react-confetti'
import chroma from 'chroma-js';



// ==============================
// The withStateMachine higher-order component accepts:
// 1) an xstate configuration object or an xstate machine,
// 2) some options,
// 3) and a component.

// It returns a NEW component with
// special props, action and activity methods and additional lifecycle hooks.

// The initial machine state and the initial data can be passed to
// the resulting component through the initialMachineState and initialData props.

// https://github.com/MicheleBertoli/react-automata
// ==============================




// ==============================
// React Automata State Chart
// States, TRANSITIONS, & Functions
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
        GO_TO_ATTEMPT_N: 'attemptN',
        NO_MORE_ROUNDS: 'gameOver',
      },
    },
    attemptN: {
      onEntry: 'attemptN',
      on: {
        SELECT_COLOR: 'checkSolution',
        OUT_OF_ATTEMPTS: 'playerLoosesRound',
      },
    },
    checkSolution: {
      onEntry: 'checkSolution',
      on: {
        CORRECT_SOLUTION: 'playerWinsRound',
        INCORRECT_SOLUTION: 'attemptN',
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
    gameOver: {
      onEntry: 'gameOver',
      on: {
        PLAY_AGAIN: 'roundN',
        DONT_PLAY_AGAIN: 'homeScreenPractice',
      }
    }
  }
}


// ===========================================
// ===========================================
// ===========================================
// ===========================================



class App extends React.Component {
  constructor(props) {
  super(props);

  this.state = {
    round: 0,
    maxAttemptCount: 6,
    maxLossCount: 10,
    // maxLossCount: 2,
    looseRound: 0,
    maxLossCount: 10,
    // maxLossCount: 2,
    attempt: 0,
    score: 0,
    colorRound: colorRound,
    allColorBubbles: [],
    currentField: 'leftField',
    currentFieldHover: 'leftField',
    leftField: {'backgroundColor': null},
    rightField: {'backgroundColor': null},
    isAudioOn: true,
    confettiFalling: false,

  };

  // This binding is necessary to make `this` work in the callback
  this.updateFieldColor = this.updateFieldColor.bind(this)
  this.soundButtonToggle = this.soundButtonToggle.bind(this)
  this.currentFieldMouseEnter = this.currentFieldMouseEnter.bind(this)
  this.currentFieldMouseLeave = this.currentFieldMouseLeave.bind(this)
  this.showSolution = this.showSolution.bind(this)
  this.resetScore = this.resetScore.bind(this)
  this.startGameClickHandler = this.startGameClickHandler.bind(this)
}



//  =================================
//  State Machine Functions
//  All the component's methods whose names match the names of actions and activities,
//  are fired when the related transition happen. Actions receive the state and the event
//  as arguments. Activities receive a boolean that is true when the activity should start,
//  and false otherwise.
//  =================================
 readyAction = () => {
  this.props.transition('READY')
}

homeScreenPractice(){
  this.setState({confettiFalling: false})
}

resetScore(){
  this.setState({score:0})
}

roundN(){
  this.setState({confettiFalling: false})
  this.setState({attempt: 0})
  this.beginGameSound()
  this.props.transition('INCREMENT_ROUND_COUNTER')
}

incrementRoundCounter() {
  if (this.state.round >= this.state.maxLossCount) {
    this.props.transition("NO_MORE_ROUNDS")

  } else if (this.state.round < this.state.maxLossCount)
  {
    this.setState({round: (this.state.round + 1)})
    this.generateColorRound()
    this.setState({"leftField": {'backgroundColor': null}})
    this.setState({"rightField": {'backgroundColor': null}})
    this.props.transition("GO_TO_ATTEMPT_N")
  } else {
    console.log("incrementRoundCounter() This shouldn't be triggering. Something is wrong.")
  }
}

attemptN() {
  if (this.state.attempt < 6) {
    this.props.transition("CHECK_SOLUTION")
  } else if (this.state.attempt >= 6) {
    console.log("OUT_OF_ATTEMPTS")
    this.props.transition("OUT_OF_ATTEMPTS")
  }
}

checkSolution() {
  let leftFieldBackgroundColor = this.state.leftField.backgroundColor;
  let rightFieldBackgroundColor = this.state.rightField.backgroundColor;
  let solutionColors = this.state.colorRound.solutionColors;
  let solutionColor1 = this.state.colorRound.solutionColor1;
  let solutionColor2 = this.state.colorRound.solutionColor2;
  let wrongColors = this.state.colorRound.wrongColors;
  console.log("wrongColors: ", wrongColors)
  console.log("solutionColors: ", solutionColors)
  console.log("leftFieldBackgroundColor: ", leftFieldBackgroundColor, "rightFieldBackgroundColor: ", rightFieldBackgroundColor)
  console.log("this.state.attempt: ", this.state.attempt)


  // Not enough trys: incorrect
  if (this.state.attempt === 1) {
    console.log("There has only been one guess. => INCORRECT_SOLUTION")
    this.props.transition("INCORRECT_SOLUTION")

  // both sides are the same: incorrect
  } else if (leftFieldBackgroundColor === rightFieldBackgroundColor) {
    console.log(" Both fields the same. Incorrect Solution. leftFieldBackgroundColor: ", leftFieldBackgroundColor, "rightFieldBackgroundColor: ", rightFieldBackgroundColor)
    this.props.transition("INCORRECT_SOLUTION")

  // incorrect
  } else if ( (this.state.attempt > 1) && (wrongColors.includes(leftFieldBackgroundColor || rightFieldBackgroundColor) ) )
   {
     console.log("INCORRECT_SOLUTION")
     this.props.transition("INCORRECT_SOLUTION")

  // correct
   } else if ( solutionColors.includes( chroma(leftFieldBackgroundColor).hex() ) && solutionColors.includes( chroma(rightFieldBackgroundColor).hex()  )   )
   {
    console.log("CORRECT_SOLUTION")
    this.props.transition("CORRECT_SOLUTION")

   // Ask yourself, "self, why is this triggering?"
   } else {
    this.props.transition("INCORRECT_SOLUTION")
   }
 }

playerWinsRound() {
  this.playWinSound();
  this.setState({confettiFalling: true})
  this.setState({score: (this.state.score + 1)})
  console.log("player wins round")

      let stateTransition = () => {
        if (this.state.round < this.state.maxLossCount) {
          console.log('NEXT_ROUND')
          this.props.transition('NEXT_ROUND')
        } else if (this.state.round >= this.state.maxLossCount){
          console.log('NO_MORE_ROUNDS')
          this.props.transition('NO_MORE_ROUNDS')
        }
      }

    setTimeout(function() {
      console.log("setTimeout 2000")
      // function to be executed after 2 seconds
      stateTransition()
    }, 2000);
}

playerLoosesRound() {
  if (this.state.round <= this.state.maxLossCount) {
   console.log("player looses round")
   this.playLoseSound()
   this.setState({'looseRound': this.state.looseRound + 1})
   this.props.transition('SHOW_SOLUTION')
 }
}

showSolution() {
  console.log("showSolution")

  this.setState({"leftField": {
    'backgroundColor': this.state.colorRound.solutionColor1,
    'animation': 'fadein 1.25s'
  }});
  this.setState({"rightField": {
    'backgroundColor': this.state.colorRound.solutionColor2,
    'animation': 'fadein 1.25s'
  }});

    let transition = () => {
      if (this.state.round < this.state.maxLossCount) {
        console.log(`this.props.transition('NEXT_ROUND')`)
        this.props.transition('NEXT_ROUND')
      // } else if (this.state.round === this.state.maxLossCount) {
      } else if (this.state.round === this.state.maxLossCount) {
        console.log(`this.props.transition('NO_MORE_ROUNDS')`)
        this.props.transition('NO_MORE_ROUNDS')
      }
    }

    setTimeout(function() {
    // Transition to next round after X seconds
    transition()
    }, 2500);
};


gameOver() {
  this.setState({attempt: 0})
  this.setState({round: 0})
  this.setState({confettiFalling: true})
}
// *****************************************************
// *****************************************************
// *****************************************************
// *****************************************************

  generateColorRound(){

    let newColorRound = {
      name: 'chroma-js',
      solutionColor1: chroma.random().hex(),
      solutionColor2: chroma.random().hex(),
      wrongColors: [chroma.random().hex(), chroma.random().hex(), chroma.random().hex(), chroma.random().hex()],
      get targetColor() {
        return chroma.blend( chroma(this.solutionColor1).hex(), chroma(this.solutionColor2).hex(), 'multiply');
      },
      get solutionColors() {
        return [chroma(this.solutionColor1).hex(), chroma(this.solutionColor2).hex()]
      },
      get allColorBubbles() {
       return [this.solutionColor1, this.solutionColor2, this.wrongColors[0], this.wrongColors[1], this.wrongColors[2], this.wrongColors[3] ]
      }
    };

    // the function that will shuffle the allColorBubbles bubbles
    // so the first two bubbles aren't always the solution
    let shuffleColors = (array) => {

      for (let i = array.length - 1; i > 0; i--)
      {
        const j = Math.floor(Math.random() * i)
        const temp = array[i]
        array[i] = array[j]
        array[j] = temp
      }
        this.setState({"allColorBubbles": array})
    }

    shuffleColors(newColorRound.allColorBubbles)
    this.setState({"colorRound": newColorRound})
  }


  startGameClickHandler(){
    this.props.transition('START_GAME')
  }


//  ==================================================================
//  Hover handler for color bubbles - shows player which field of the
//  two fields is currently active. Note: we have to set the backgroundColor
//  otherwise it will revert to none.
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


incrementAttempt(){
  this.setState({attempt: (this.state.attempt + 1)})
}


//  ===================================
//  Click handler for the color bubbles at bottom of screen
//  ===================================
 bubbleClickHandler = (event) =>  {
  // guard clause to disable click handler if round is over
  if (this.state.round > (this.state.maxLossCount)) return
  if (this.state.confettiFalling === true) return

  this.setState({attempt: (this.state.attempt + 1)})
  this.bubbleSound();
  this.toggleLeftRightField();
  // "event" is the click on a specific color bubble.
  // "currentTarget" is whatever color bubble is clicked.
  // "style.backgroundColor" takes whatever background color
  // the clicked color bubble has, and applies that to color field
  this.updateFieldColor(event.currentTarget.style.backgroundColor);
  this.props.transition('SELECT_COLOR');
};


  //  ==================================
  //  Filling in chosen color into left or right fields
  //  ==================================
  updateFieldColor(color){
    if (this.state.round > (this.state.maxLossCount)) return
    if (this.state.attempt >= this.state.maxAttemptCount) return
    if (this.state.currentField === 'leftField') {
     this.setState({"leftField": {'backgroundColor': color}})
    } else {
      this.setState({"rightField": {'backgroundColor': color}})
    }
  };

  beginGameSound(){
    // A guard clause if the user has clicked the audio off
    if (this.state.isAudioOn === false) {return}
    const sound = new Howl({
      src: ['/sound/finger-snap.wav']
    });
    sound.play()
  };


//  ==================================
//  Mute button toggle
//  if audio is on the state of isAudioOn is true,
//  if audio is off the state of isAudioOn is false,
//  the ! is the oposite of what it currently is.
//  So, set the state to the 'oposite' of what it is.
//  ==================================
   soundButtonToggle() {
    this.setState(prevState => ({
      isAudioOn: !prevState.isAudioOn
    }));
  }


  bubbleSound(){
  // Using the Howler npm package for sound
  // There are two distinct sounds. One for the left, one for the right.
  // a guard clause if the player has toggled sound to be off
  if (this.state.isAudioOn === false) {return}

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

  componentDidMount() {
    console.log("machineState: ", this.props.machineState.value )
    this.generateColorRound()
  }


// *****************************************************
// *****************************************************
// *****************************************************
// *****************************************************

  render() {
    return (

      <div className="outer-div">
        <div className="twohue">

        <State is={['playerWinsRound']}>
          <Confetti
            run={this.state.confettiFalling}
            numberOfPieces={300}
            recycle={false}
            tweenDuration={100}
            colors={this.state.colorRound.allColorBubbles}
            opacity={0.6}
            gravity={0.4}
            />
        </State>

        <State is={['gameOver']}>
          <Confetti
            run={this.state.confettiFalling}
            numberOfPieces={600}
            recycle={true}
            tweenDuration={100}
            opacity={0.6}
            gravity={0.08}
            />
        </State>

        <Header
          transition={this.props.transition}
          round={this.state.round}
          maxLossCount={this.state.maxLossCount}
          attempt={this.state.attempt}
          score={this.state.score}
          looseRound={this.state.looseRound}
          maxLossCount={this.state.maxLossCount}
          resetScore={this.resetScore}
          beginGameSound={this.beginGameSound}
          isAudioOn={this.state.isAudioOn}
          startGameClickHandler={this.startGameClickHandler}
          />


          <div id="game-field">


            <GameField
              colorRound={this.state.colorRound}
              currentField={this.state.currentField}
              leftField={this.state.leftField}
              rightField={this.state.rightField}
              />

            <ColorBubbleTray
              round={this.state.round}
              allColorBubbles={this.state.allColorBubbles}
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

             <Byline />

             <AudioToggle
               soundButtonToggle={this.soundButtonToggle}
               isAudioOn={this.state.isAudioOn}
               />

         </footer>

      </div>
    </div>
    )
  }
};

export default withStateMachine(statechart)(App);
