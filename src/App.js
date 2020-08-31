import React from 'react';
import './App.css';
import { Action, withStateMachine, State } from 'react-automata'
import Header from './Header';
import Byline from './Byline';
import colorRounds from './colorRoundsArray';
import GameField from './GameField';
import AudioToggle from './AudioToggle';
import ColorBubbleTray from './ColorBubbleTray';
// Howler manages the sound effects
import {Howl} from 'howler';
import Confetti from 'react-confetti'



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


let maxAttemptCount = 6


class App extends React.Component {
  constructor(props) {
  super(props);

  this.state = {
    round: 0,
    maxRoundCount: (colorRounds.length - 1),
    // maxRoundCount: 3,
    attempt: 0,
    score: 0,
    colorRound: colorRounds[0],
    currentField: 'leftField',
    currentFieldHover: 'leftField',
    leftField: {'backgroundColor': null},
    rightField: {'backgroundColor': null},
    isAudioOn: false,
    confettiFalling: false
  };

  // This binding is necessary to make `this` work in the callback
  this.updateFieldColor = this.updateFieldColor.bind(this)
  this.muteButtonToggle = this.muteButtonToggle.bind(this)
  this.currentFieldMouseEnter = this.currentFieldMouseEnter.bind(this)
  this.currentFieldMouseLeave = this.currentFieldMouseLeave.bind(this)
  this.showSolution = this.showSolution.bind(this)
  this.resetScore = this.resetScore.bind(this)
  this.startGameClickHandler = this.startGameClickHandler.bind(this)
}



//  =================================
//  State Machine Functions
//  =================================
 readyAction = () => {
  this.props.transition('READY')
}


homeScreenPractice(){

}


resetScore(){
  this.setState({score:0})
  console.log("resetting score to 0")
}

roundN(){
  this.setState({confettiFalling: false})
  this.props.transition('INCREMENT_ROUND_COUNTER')
  this.setState({attempt: 0})
  this.startSound()
}

incrementRoundCounter() {
  if (this.state.round >= this.state.maxRoundCount) {
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
  // let solutionColor1 = this.state.colorRound.solutionColor1;
  // let solutionColor2 = this.state.colorRound.solutionColor2;
  let wrongColors = this.state.colorRound.wrongColors;
  console.log("leftFieldBackgroundColor: ", leftFieldBackgroundColor, "rightFieldBackgroundColor: ", rightFieldBackgroundColor)
  console.log("wrongColors: ", wrongColors)
  console.log("this.state.attempt: ", this.state.attempt)


  // Not enough trys: incorrect
  if (this.state.attempt === 1) {
    console.log("There has only been one guess. => INCORRECT_SOLUTION")
    this.props.transition("INCORRECT_SOLUTION")

  // both sides are the same: incorrect
  // why isn't this working?
  } else if (leftFieldBackgroundColor == rightFieldBackgroundColor) {
    console.log(" Both fields the same. Incorrect Solution. leftFieldBackgroundColor: ", leftFieldBackgroundColor, "rightFieldBackgroundColor: ", rightFieldBackgroundColor)
    this.props.transition("INCORRECT_SOLUTION")

  // incorrect
  } else if ( (this.state.attempt > 1) && (wrongColors.includes(leftFieldBackgroundColor || rightFieldBackgroundColor) ) )
   {
     console.log("INCORRECT_SOLUTION")
     this.props.transition("INCORRECT_SOLUTION")

  // correct
   } else if ( solutionColors.includes(leftFieldBackgroundColor) && solutionColors.includes(rightFieldBackgroundColor))
   {
    console.log("CORRECT_SOLUTION")
    this.props.transition("CORRECT_SOLUTION")

   // why is this triggering?
   } else {
    console.log("checkSolution() hasn't accounted for this case")
    this.props.transition("INCORRECT_SOLUTION")
   }
 }


playerWinsRound() {
  this.playWinSound();
  this.setState({confettiFalling: true})
  this.setState({score: (this.state.score + 1)})
  console.log("player wins round")
    // commented out b/c currently this action is happening within the button click
    // this.props.transition('NEXT_ROUND')

      let transition = () => {
        if (this.state.round < this.state.maxRoundCount) {
          console.log('NEXT_ROUND')
          this.props.transition('NEXT_ROUND')
        } else if (this.state.round >= this.state.maxRoundCount){
          console.log('NO_MORE_ROUNDS')
          this.props.transition('NO_MORE_ROUNDS')
        }
      }

    setTimeout(function() {
      console.log("setTimeout 2000")
      //code to be executed after 2 seconds
      transition()
    }, 2000);

}


playerLoosesRound() {
  if (this.state.round < this.state.maxRoundCount) {
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
      if (this.state.round < this.state.maxRoundCount) {
        console.log(`this.props.transition('NEXT_ROUND')`)
        this.props.transition('NEXT_ROUND')
      } else if (this.state.round === this.state.maxRoundCount) {
        console.log(`this.props.transition('NO_MORE_ROUNDS')`)
        this.props.transition('NO_MORE_ROUNDS')
      }
    }

    setTimeout(function() {
      // console.log("setTimeout 2500")
    //your code to be executed after 2 seconds
    transition()
    }, 3800);

};


gameOver() {
  console.log("game over")
  this.setState({attempt: 0})
  this.setState({round: 0})
}
// *********************************************************************
// *********************************************************************
// *********************************************************************
// *********************************************************************

startGameClickHandler(){
  this.props.transition('START_GAME')
}








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


incrementAttempt(){
  this.setState({attempt: (this.state.attempt + 1)})
}


//  ===================================
//  Click handler for the color bubbles at bottom of screen
//  ===================================
 bubbleClickHandler = (event) =>  {
  // guard clause to disable click handler if round is over
  if (this.state.round > (this.state.maxRoundCount)) return
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
//  Filling in chosen color into left or right fields,
//  then checking if winning solution (as a callback function)
//  ==================================
updateFieldColor(color){
  if (this.state.round > (this.state.maxRoundCount)) return
  if (this.state.attempt >= maxAttemptCount) return
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


//  Mute button toggle, if audio is on,
//  the !(not) turns it off and vice versa
   muteButtonToggle() {
    this.setState(prevState => ({
      isAudioOn: !prevState.isAudioOn
    }));
  }


  bubbleSound(){
  // Using the Howler npm package for sound
  // There are two distinct sounds. One for the left, one for the right.
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

  componentDidUpdate() {
    console.log("machineState: ", this.props.machineState.value )
  }




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
            opacity={0.5}
            gravity={0.4}
            />
        </State>

        <State is={['gameOver']}>
          <Confetti
            run={this.state.confettiFalling}
            numberOfPieces={600}
            recycle={true}
            tweenDuration={100}
            // colors={this.state.colorRound.allColorBubbles}
            opacity={0.5}
            gravity={0.1}
            />
        </State>

        <Header
          transition={this.props.transition}
          round={this.state.round}
          maxRoundCount={this.state.maxRoundCount}
          attempt={this.state.attempt}
          score={this.state.score}
          resetScore={this.resetScore}
          startSound={this.startSound}
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
              colorRound={this.state.colorRound}
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

           <Byline />

           <AudioToggle muteButtonToggle={this.muteButtonToggle}
                        isAudioOn={this.state.isAudioOn}
                       />
        </footer>
      </div>
    </div>
    )
  }
}

export default withStateMachine(statechart)(App)

