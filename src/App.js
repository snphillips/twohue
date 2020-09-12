import React from 'react';
import { Action, withStateMachine, State } from 'react-automata'
import './App.css';
import Header from './Header';
import Byline from './Byline';
import GameField from './GameField';
import AudioToggle from './AudioToggle';
import ColorBubbleTray from './ColorBubbleTray';
// Howler manages the sound effects
import {Howl} from 'howler';
// Color are all generated and mixed using chroma.js
import chroma from 'chroma-js';
import Confetti from 'react-confetti'

// ==============================
// The withStateMachine higher-order component accepts:
// 1) an Xstate configuration object or an Xstate machine,
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
        SET_UP_COLOR_ROUND: 'setUpColorRound',
      },
    },
    setUpColorRound: {
      onEntry: 'setUpColorRound',
      on: {
        PLAY_ROUND: 'playRound',
        NO_MORE_ROUNDS: 'gameOver',
      },
    },
    playRound: {
      onEntry: 'playRound',
      on: {
        ATTEMPT_N: 'attemptN',
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
let newColorRound = [];

class App extends React.Component {
  constructor(props) {
  super(props);

  this.state = {
    round: 0,
    attempt: 0,
    maxAttemptCount: 6,
    looseRound: 0,
    maxLossCount: 6,
    score: 0,
    colorRound: {} ,
    allColorBubbles: [],
    numWrongColorBubbles: 0,
    currentField: 'leftField',
    currentFieldHover: 'leftField',
    leftField: {'backgroundColor': '#fff'},
    rightField: {'backgroundColor': '#fff'},
    isAudioOn: true,
    confettiFalling: false,

  };

  // This binding is necessary to make `this` work in the callback
  this.updateFieldColor = this.updateFieldColor.bind(this)
  this.soundButtonToggle = this.soundButtonToggle.bind(this)
  this.currentFieldMouseEnter = this.currentFieldMouseEnter.bind(this)
  this.currentFieldMouseLeave = this.currentFieldMouseLeave.bind(this)
  this.showSolution = this.showSolution.bind(this)
  this.resetScoreForNextGame = this.resetScoreForNextGame.bind(this)
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
  this.generateColorRound()
}

homeScreenPractice(){
  this.setState({confettiFalling: false})
}

roundN(){
  console.log("round: ", this.state.round)
  this.beginRoundSound()
  this.setState({confettiFalling: false})
  this.setState({attempt: 0})
  this.props.transition('INCREMENT_ROUND_COUNTER')
}

incrementRoundCounter() {
  if (this.state.looseRound >= this.state.maxLossCount) {
    this.props.transition("NO_MORE_ROUNDS")

  } else if (this.state.looseRound < this.state.maxLossCount)
  {
    this.setState({round: (this.state.round + 1)})
    this.setState({"leftField": {'backgroundColor': "#fff"}})
    this.setState({"rightField": {'backgroundColor': "#fff"}})
    this.calculateNumWrongColorBubbles()
    this.props.transition("SET_UP_COLOR_ROUND")
  } else {
    console.log("incrementRoundCounter() This shouldn't be triggering. Something is wrong.")
    console.log("this.state.looseRound: ", this.state.looseRound, "this.state.maxLossCount: ", this.state.maxLossCount)
  }
}

setUpColorRound(){
  this.generateColorRound()
  this.props.transition('PLAY_ROUND')
}

playRound(){
  this.props.transition('ATTEMPT_N')
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
  let wrongColorBubbles = this.state.colorRound.wrongColors;
  console.log("wrongColorBubbles: ", wrongColorBubbles)
  console.log("solutionColors: ", solutionColors)
  console.log("leftFieldBackgroundColor: ", leftFieldBackgroundColor, "rightFieldBackgroundColor: ", rightFieldBackgroundColor )
  console.log("this.state.attempt: ", this.state.attempt)


  // Not enough trys: incorrect
  if (this.state.attempt === 1) {
    console.log("There has only been one guess. => INCORRECT_SOLUTION")
    this.props.transition("INCORRECT_SOLUTION")
   }

  // incorect
   else if ( (this.state.attempt > 1) &&
             (wrongColorBubbles.includes(leftFieldBackgroundColor || rightFieldBackgroundColor) ) )
   {
     console.log("INCORRECT_SOLUTION")
     this.props.transition("INCORRECT_SOLUTION")

  // correct
   } else if (
    ( solutionColors.includes(chroma(leftFieldBackgroundColor).hex()) && solutionColors.includes( chroma(rightFieldBackgroundColor).hex())  )
    // the colors can't be the same on either side
    && ( chroma(leftFieldBackgroundColor).hex() !== chroma(rightFieldBackgroundColor).hex()  )
    )
   {
    console.log("CORRECT_SOLUTION")
    this.props.transition("CORRECT_SOLUTION")

   // Ask yourself, "self, why is this triggering?"
   } else {
    this.props.transition("INCORRECT_SOLUTION")
    console.log("INCORRECT_SOLUTION - why is this triggering?")
   }
 }

playerWinsRound() {
  this.playWinSound();
  this.setState({confettiFalling: true})
  // this.setState({score: (this.state.score + 1)})
  this.playerWinsPoints()
  console.log("player wins round")

      let stateTransition = () => {
        if (this.state.looseRound < this.state.maxLossCount) {
          console.log('NEXT_ROUND')
          this.props.transition('NEXT_ROUND')
        } else if (this.state.looseRound >= this.state.maxLossCount){
          console.log('NO_MORE_ROUNDS this.state.maxLossCount:', this.state.maxLossCount)
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
  if (this.state.looseRound <= this.state.maxLossCount) {
   console.log("player looses round")
   this.playLoseSound()
   this.setState({'looseRound': this.state.looseRound + 1})
   this.props.transition('SHOW_SOLUTION')
 }
}

showSolution() {
  console.log("showSolution", this.state.colorRound.solutionColor1, this.state.colorRound.solutionColor2)

  this.setState({"leftField": {
    'backgroundColor': this.state.colorRound.solutionColor1,
    'animation': 'fadein 1.25s'
  }});
  this.setState({"rightField": {
    'backgroundColor': this.state.colorRound.solutionColor2,
    'animation': 'fadein 1.25s'
  }});

    let transition = () => {
      if (this.state.looseRound < this.state.maxLossCount) {
        console.log(`this.props.transition('NEXT_ROUND')`)
        this.props.transition('NEXT_ROUND')
      } else if (this.state.looseRound >= this.state.maxLossCount) {
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
  this.gameOverChimes()
  this.setState({attempt: 0})
  this.setState({round: 0})
  this.setState({looseRound: 0})
  this.setState({confettiFalling: true})
}
// *****************************************************
// ** End State Machine Functions **********************
// *****************************************************



// *****************************************************
// *****************************************************
// *****************************************************
// ** Start Regular Functions **************************
// *****************************************************
// *****************************************************
// *****************************************************
  handleClick = () => {
    this.props.transition('READY')
  }

  componentDidMount() {
    console.log("machineState: ", this.props.machineState.value )
  }

  componentDidUpdate() {
    console.log("machineState: ", this.props.machineState.value )
    // console.log("this.state.allColorBubbles", this.state.allColorBubbles)
  }

  calculateNumWrongColorBubbles(){

    // if (this.state.round <= 1) return

    if (this.state.round <= 1) {
      this.setState({ numWrongColorBubbles: 1 },() => {
        console.log("calculateNumWrongColorBubbles() round: ", this.state.round, "numWrongColorBubbles: ", this.state.numWrongColorBubbles )
      })
    } else if (this.state.round === 2) {
      this.setState({ numWrongColorBubbles: 2 },() => {
        console.log("calculateNumWrongColorBubbles() round: ", this.state.round, "numWrongColorBubbles: ", this.state.numWrongColorBubbles )
      })
    } else if (this.state.round === 3) {
      this.setState({ numWrongColorBubbles: 3 },() => {
        console.log("calculateNumWrongColorBubbles() round: ", this.state.round, "numWrongColorBubbles: ", this.state.numWrongColorBubbles )
      })
    } else if ( (this.state.round >= 4) && (this.state.round <= 9) ) {
      this.setState({ numWrongColorBubbles: 4 },() => {
        console.log("calculateNumWrongColorBubbles() round: ", this.state.round, "numWrongColorBubbles: ", this.state.numWrongColorBubbles )
      })
    } else if (this.state.round >=10) {
      this.setState({ numWrongColorBubbles: 5 },() => {
        console.log("calculateNumWrongColorBubbles() round: ", this.state.round, "numWrongColorBubbles: ", this.state.numWrongColorBubbles )
      })
    }
  }

  generateColorRound(){
    let soluColor1;
    let soluColor2;
    let targColor;
    let colorLightness = 19;
    let numWrongColorBubbles = this.state.numWrongColorBubbles
    // is this needed?
    let wrongColorsArray = [];

  //=============================
  // If the target color is too dark (like blackish),
  // the round is nearly impossible to play.
  // To solve, we're now allowing rounds with very dark target color.

  // Use a while-loop to genereate solution & target
  // colors. Keep looping until it finds a solution
  // that ISN'T too dark. We're using Chroma.js's .get('lab.l')
  // to determine lightness.
  //=============================
    while (colorLightness <= 20) {

      soluColor1 = chroma.random().hex()
      soluColor2 = chroma.random().hex()
      targColor = chroma.blend( chroma(soluColor1).hex(), chroma(soluColor2).hex(), 'multiply');
      colorLightness = chroma( targColor ).get('lab.l')
      // console.log("colorLightness: ", colorLightness)

    };


    let newColorRound = {

      solutionColor1: soluColor1,
      solutionColor2: soluColor2,
      targetColor: targColor,

      // Only create enough wrongColors to fill in the color bubbles.
      // For instance, the practice round only has two bubbles total
      // (therefore no wrong colors are needed).
      get wrongColors() {

        wrongColorsArray = [];

        for (let i = numWrongColorBubbles; i > 0; i--) {

          wrongColorsArray.push(  chroma.random().hex()  );
        }
        return wrongColorsArray
      },


      get solutionColors() {
        return [chroma(this.solutionColor1).hex(), chroma(this.solutionColor2).hex()]
      },
      get allColorBubbles() {
        return this.solutionColors.concat(this.wrongColors);
      }
    };


    // The function that shuffles the allColorBubbles bubbles
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

playerWinsPoints() {
  console.log("playerWinsPoints()", this.state.attempt )

  if (this.state.attempt === 6 ) {
    this.setState({score: (this.state.score + 1)})
  } else if ( this.state.attempt === 5 ) {
    this.setState({score: (this.state.score + 2)})
  } else if ( this.state.attempt === 4 ) {
    this.setState({score: (this.state.score + 3)})
  } else if ( this.state.attempt === 3 ) {
    this.setState({score: (this.state.score + 4)})
  } else if ( this.state.attempt === 2 ) {
    this.setState({score: (this.state.score + 6)})
  }
}


//  ===================================
//  Click handler for the color bubbles at bottom of screen
//  ===================================
 bubbleClickHandler = (event) =>  {
  // guard clause to disable click handler if:
  // 1) round is over,
  // 2) player is out of attempts,
  // 3) the game is over.
  if (this.state.looseRound > (this.state.maxLossCount)) return
  if (this.state.attempt >= this.state.maxAttemptCount) return
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
    if (this.state.looseRound > (this.state.maxLossCount)) return
    if (this.state.attempt >= this.state.maxAttemptCount) return
    if (this.state.currentField === 'leftField') {
     this.setState({"leftField": {'backgroundColor': color}})
    } else {
      this.setState({"rightField": {'backgroundColor': color}})
    }
  };

  beginRoundSound(){
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
      src: ['/sound/wrong-guess.wav']
    });
    sound.play()
  };

  gameOverChimes(){
      // A guard clause if the user has clicked the audio off
    if (this.state.isAudioOn === false) {return}
    const sound = new Howl({
      src: ['/sound/windchimes.mp3']
    });
    sound.play()
  };

  resetScoreForNextGame(){
    this.setState({score:0})
    this.setState({looseRound:0})
  }





// *****************************************************
// *****************************************************
// *****************************************************
// *****************************************************

  render() {

  // for confetti to fall accross whole window,
  // even if user resized window.
  let width = window.innerWidth
  let height = window.innerHeight



    return (


      <div className="outer-div">
        <div className="twohue">

        <State is={['playerWinsRound']}>
          <Confetti
            width={width}
            height={height}
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
          resetScoreForNextGame={this.resetScoreForNextGame}
          beginRoundSound={this.beginRoundSound}
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
