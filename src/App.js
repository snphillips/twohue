import React from 'react';
import { Action, withStateMachine, State } from 'react-automata';
import './App.css';
import Header from './Header';
import Byline from './Byline';
import GameField from './GameField';
import AudioToggle from './AudioToggle';
import ColorBubbleTray from './ColorBubbleTray';
import GameOverScreen from './GameOverScreen';
import Leaderboard from './Leaderboard';
import {Howl} from 'howler'; // Howler manages the sound effects
import chroma from 'chroma-js'; // Color are all generated and mixed using chroma.js
import Confetti from 'react-confetti';
import axios from 'axios';
import statechart from './statechart';

let dataSource = "https://twohue-leaderboard-server.herokuapp.com/players";
// let dataSource = "http://localhost:3001/players";


class App extends React.Component {
  constructor(props) {
  super(props);

  this.state = {
    round: 0,
    attempt: 0,
    maxAttemptCount: 6,
    looseRound: 0,
    // maxLossCount: 6,
    maxLossCount: 1,
    previousScore: 0,
    score: 0,
    colorRound: {} ,
    wrongColors: [],
    allColorBubbles: [],
    numWrongColorBubbles: 0,
    currentField: 'leftField',
    currentFieldHover: 'leftField',
    leftField: {'backgroundColor': '#fff'},
    rightField: {'backgroundColor': '#fff'},
    isAudioOn: false,
    confettiFalling: false,
    playerWinRound: false,
    leaderboardData: [],
    newLeaderboardInductee: '',
    leaderboardServerDown: false
  };

  // This binding is necessary to make `this` work in the callback
  this.updateFieldColor = this.updateFieldColor.bind(this);
  this.soundButtonToggle = this.soundButtonToggle.bind(this);
  this.currentFieldMouseEnter = this.currentFieldMouseEnter.bind(this);
  this.currentFieldMouseLeave = this.currentFieldMouseLeave.bind(this);
  this.showSolution = this.showSolution.bind(this);
  this.resetScoreForNextGame = this.resetScoreForNextGame.bind(this);
  this.startGameClickHandler = this.startGameClickHandler.bind(this);
  this.handleSubmit = this.handleSubmit.bind(this);
  this.handleChange = this.handleChange.bind(this);
  this.axiosPostNewLeaderboardInductee = this.axiosPostNewLeaderboardInductee.bind(this);
  this.axiosGetAllLeaderboardResults = this.axiosGetAllLeaderboardResults.bind(this);
  // this.evaluateIfLeaderboardMaterial = this.evaluateIfLeaderboardMaterial.bind(this);
}


//  =================================
//  State Machine Functions
//  All the component's methods whose names match the names of actions and activities,
//  are fired when the related transition happen. Actions receive the state and the event
//  as arguments. Activities receive a boolean that is true when the activity should start,
//  and false otherwise.
//  =================================
 readyAction(){
  this.props.transition('READY')
  this.generateColorRound()
 }

 homeScreenPractice(){


}

fadeInRoundN() {
  this.props.transition('FADE_IN_ROUND')
}

roundN(){
  this.transitionBetweenStates("#color-bubble-tray", "transition-enter")
  this.transitionBetweenStates("#target-swatch", "transition-enter")
  this.transitionBetweenStates("#game-field", "transition-enter")
  this.transitionBetweenStates(".message-board", "transition-enter")

  this.beginRoundSound()
  this.setState({confettiFalling: false})
  this.setState({playerWinRound: false})
  this.setState({attempt: 0})
  this.props.transition('INCREMENT_ROUND_COUNTER')
}

incrementRoundCounter() {
  if (this.state.looseRound >= this.state.maxLossCount) {
    this.props.transition("NO_MORE_ROUNDS")
  } else if (this.state.looseRound < this.state.maxLossCount)
  {
    this.setState({round: (this.state.round + 1)})
    this.calculateNumWrongColorBubbles()
    this.props.transition("SET_UP_COLOR_ROUND")
  } else {
    // console.log("incrementRoundCounter() This shouldn't be triggering. Something is wrong.")
    // console.log("this.state.looseRound: ", this.state.looseRound, "this.state.maxLossCount: ", this.state.maxLossCount)
  }
}

setUpColorRound(){
  this.setState({"leftField": {'backgroundColor': "#fff"}})
  this.setState({"rightField": {'backgroundColor': "#fff"}})
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
    // console.log("OUT_OF_ATTEMPTS")
    this.props.transition("OUT_OF_ATTEMPTS")
  }
}

checkSolution() {
  let leftFieldBackgroundColor = this.state.leftField.backgroundColor;
  let leftFieldHexColor = chroma(leftFieldBackgroundColor).hex();
  let rightFieldBackgroundColor = this.state.rightField.backgroundColor;
  let rightFieldHexColor = chroma(rightFieldBackgroundColor).hex();
  let solutionColors = this.state.colorRound.solutionColors;
  let solutionColor1 = this.state.colorRound.solutionColor1;
  let solutionColor2 = this.state.colorRound.solutionColor2;
  // let wrongColorBubbles = this.state.colorRound.wrongColors;
  let wrongColorBubbles = this.state.wrongColors;
  let attempts = this.state.attempt

  // Not enough trys: incorrect
  if (attempts === 1)
  {
    console.log("There has only been one guess. => INCORRECT_SOLUTION")
    this.props.transition("INCORRECT_SOLUTION")

  // correct
   } else if ( ( solutionColors.includes( leftFieldHexColor ) && solutionColors.includes( rightFieldHexColor )  )
    // the colors can't be the same on either side
    && ( leftFieldHexColor !== rightFieldHexColor  ))
   {
    this.props.transition("CORRECT_SOLUTION")
    console.log("CORRECT_SOLUTION")

   // incorrect
   } else {
    this.props.transition("INCORRECT_SOLUTION")
    console.log("INCORRECT attempts:", this.state.attempt)
   }
 }



playerWinsRound() {
  this.playWinSound();
  this.setState({playerWinRound: true})
  this.setState({confettiFalling: true})
  this.playerWinsPoints()

  console.log("player wins round")

      let stateTransition = () => {
        if (this.state.looseRound < this.state.maxLossCount) {
          // console.log('NEXT_ROUND')
          this.props.transition('FADE_IN_ROUND')
        } else if (this.state.looseRound >= this.state.maxLossCount){
          console.log('NO_MORE_ROUNDS this.state.maxLossCount:', this.state.maxLossCount)
          this.props.transition('NO_MORE_ROUNDS')
        }
      }

    setTimeout(function() {
      // function to be executed after 2 seconds
      stateTransition()

    }, 1500);
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
    }, 1000);
};


gameOver() {
  this.gameOverChimes()
  this.setState({attempt: 0})
  this.setState({round: 0})
  this.setState({looseRound: 0})
  this.setState({confettiFalling: true})
  this.props.transition('GAME_OVER_TRANSITION')
}





gameOverTransition(){


     if (this.state.leaderboardServerDown === true) {
      console.log("leaderboard is not available")
      this.props.transition('DO_NOT_JOIN_LEADERBOARD');
     }


    let evaluateIfLeaderboardMaterial = () =>  {
      console.log("evaluateIfLeaderboardMaterial()", this.state.leaderboardData)
      // checking if the player's score in equal to or higher than
      // the lowest/last score in the array

      let leaderboardMembers = this.state.leaderboardData

      // What is smaller? 9 or the "array length - 1"?
      // Either pick the last item in the array, or the 10th item,
      // whichever is smaller.
      // We do this in case the array has fewer than 10 members.
      let lowestCurrentScoreIndex = Math.min(9, (leaderboardMembers.length - 1));
      let lowestCurrentScore = leaderboardMembers[lowestCurrentScoreIndex].score
      let score = this.state.score

      console.log("lowestCurrentScoreIndex:", lowestCurrentScoreIndex)
      console.log("lowestLeaderBoard score:", lowestCurrentScore)
      console.log("current score:", score)

      if (score >= lowestCurrentScore) {
        console.log("score is higher than lowestCurrentScore")
        this.props.transition('JOIN_LEADERBOARD');
        //
      } else {
        console.log("score is lower than lowestCurrentScore")
        this.props.transition('DO_NOT_JOIN_LEADERBOARD');
      }
    }

  setTimeout(function() {
    // Transition to leaderboard after X seconds
    evaluateIfLeaderboardMaterial()
  }, 3000);

}


joinLeaderboard(){
  this.transitionBetweenStates("#leaderboard-component", "transition-enter")
  this.transitionBetweenStates(".play-again-button", "transition-enter")
}

leaderboard() {
  this.transitionBetweenStates("#leaderboard-component", "transition-enter")
  this.transitionBetweenStates(".play-again-button", "transition-enter")
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
  transitionBetweenStates(selector, classToAdd) {
    console.log("transitioning between states")
    document.querySelector(selector).classList.add(classToAdd)
  }


  handleClick() {
    this.props.transition('READY')
  }

  componentDidMount() {
    console.log("machineState: ", this.props.machineState.value )
    this.axiosGetAllLeaderboardResults()
  }

  componentDidUpdate() {
    console.log("machineState: ", this.props.machineState.value )
  }


  calculateNumWrongColorBubbles(){

    let round = this.state.round
    let numberWrongColorBubbles = 0

    if (round <= 1) {
      numberWrongColorBubbles = 1
    } else if (round === 2) {
      numberWrongColorBubbles = 2
    } else if (round === 3) {
      numberWrongColorBubbles = 3
    } else if ( (round >= 4) && (round <= 9) ) {
      numberWrongColorBubbles = 4
    } else if ( (round >= 10) && (round <= 14) ) {
      numberWrongColorBubbles = 5
    } else if (round >= 15) {
      numberWrongColorBubbles = 6
    }
    this.setState({numWrongColorBubbles: numberWrongColorBubbles})
  }

  generateColorRound(){
    let soluColor1;
    let soluColor2;
    let targColor;
    let colorLightness = 29;
    let numWrongColorBubbles = this.state.numWrongColorBubbles;
    let wrongColorsArray = [];

  //=============================
  // If the target color is too dark (like blackish),
  // the round is nearly impossible to play.
  // To solve this problem, we're not allowing rounds with very dark target color.

  // Use a while-loop to genereate solution & target
  // colors. Keep looping until it finds a solution
  // that ISN'T too dark. We're using Chroma.js's .get('lab.l')
  // to determine lightness.
  //=============================
    while (colorLightness <= 30) {

      soluColor1 = chroma.random().hex()
      soluColor2 = chroma.random().hex()
      targColor = chroma.blend( chroma(soluColor1).hex(), chroma(soluColor2).hex(), 'multiply');
      colorLightness = chroma( targColor ).get('lab.l')
      // console.log("colorLightness: ", colorLightness)
    };


    // ~~~~~~~~~~~~~~~~~~~~~~~~
    let newColorRound = {

      solutionColor1: soluColor1,
      solutionColor2: soluColor2,
      targetColor: targColor,

      // Only create enough wrongColors to fill in the color bubbles.
      // For instance, the practice round only has two bubbles total
      // (therefore no wrong colors are needed).
      // numWrongColorBubbles tells us how many times we generate a
      // random "wrong color" to push into t
      get wrongColors() {

        // first, empty the array of old colors
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
    // ~~~~~~~~~~~~~~~~~~~~~~~~


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
    this.setState({colorRound: newColorRound})
    this.setState({wrongColors: wrongColorsArray}, () => {
      console.log("newColorRound.wrongColors:", newColorRound.wrongColors, "wrongColorsArray", wrongColorsArray, "this.state.wrongColors", this.state.wrongColors)
    })
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

if (this.state.confettiFalling === true) return

else if (this.state.currentField === 'leftField'){
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

if (this.state.confettiFalling === true) return

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
//  TODO: can you simplify this?
//  ====================================
toggleLeftRightField(){
  if (this.state.currentField === "leftField") {
    this.setState({currentField: "rightField"})
    this.setState({currentFieldHover: "rightField"})
  } else {
    this.setState({currentField: "leftField"})
    this.setState({currentFieldHover: "leftField"})
  }
}


incrementAttempt(){
  this.setState({attempt: (this.state.attempt + 1)})
}


// TODO - refactor into ternary?
playerWinsPoints() {

  let attempts =  this.state.attempt
  let score = this.state.score

  if (attempts === 6 ) {
    score = score + 1
  } else if ( attempts === 5 ) {
    score = score + 2
  } else if ( attempts === 4 ) {
    score = score + 3
  } else if ( attempts === 3 ) {
    score = score + 4
  } else if ( attempts === 2 ) {
    score = score + 6
  }
  this.setState({score: score})
}



//  ===================================
//  Click handler for the color bubbles at bottom of screen
//  ===================================
 // note: it has to be an arrow style function.
 bubbleClickHandler = (event) =>  {
  // guard clause to disable click handler if:
  // 1) the game is over,
  // 2) player is out of attempts,
  // 3) player has won the round,
  // 4) confetti is falling
  if (this.state.looseRound > (this.state.maxLossCount)) return
  if (this.state.attempt >= this.state.maxAttemptCount) return
  if (this.state.playerWinsRound === true) return
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



//  ==================================
//  Leaderboard
//  ==================================
//  GET
//  ==================================

    axiosGetAllLeaderboardResults() {
      axios.get(dataSource)
        .then( (response) => {
          this.setState({leaderboardData: response.data})
          console.log("this.state.leaderboardData: ", this.state.leaderboardData)
        })
        .catch(function (error) {
          // If there's an error
          console.log("error", error);
          this.setState({leaderboardServerDown: true})
        });
    }


  //  ==================================================================
  //  POST
  //  As soon as the user interacts with the form, newTodo updates.
  //  The API call happens once the user clicks the 'submit' button.
  //  ==================================================================
    axiosPostNewLeaderboardInductee() {
      let string = this.state.newLeaderboardInductee;
      let length = 12;
      let trimmedString = string.substring(0, length);

      this.setState({newLeaderboardInductee: trimmedString}, () => {
        console.log(string, length, trimmedString)
        console.log("Posting new result. name: ", this.state.newLeaderboardInductee, "score: ", this.state.score)
        this.props.transition('FILLED_OUT_FORM')
      })

      axios.post(dataSource, {
        player: this.state.newLeaderboardInductee || "enigma",
        score: this.state.score
      })
      .then(function (response) {
        console.log("leaderboard axios call response: ", response.data)
      })
      .then( () => {
        this.axiosGetAllLeaderboardResults()
      })
      .then( () => {
        console.log("after axiosGetAllLeaderboardResults()")
        this.props.transition('API_DATABASE_CALL_COMPLETE')
      })
      .catch(function (error) {
        console.log(error);
      });
    }

    handleChange(event) {
      console.log("leaderboard form value:",  event.target.value)
      this.setState({newLeaderboardInductee: event.target.value})
    }

    handleSubmit(event) {
      let newLeaderboardInductee = event.target.value

      this.setState({newLeaderboardInductee: newLeaderboardInductee}, () => {
        console.log('this.state.newLeaderboardInductee: ', this.state.newLeaderboardInductee);
      })
      event.preventDefault();
      // POST a new leaderboard inductee, then GET the results again.
      // The leaderboard only shows the top 10 results,
      // so the new inductee will appear in the list
      this.axiosPostNewLeaderboardInductee( () => {
        this.props.transition('FILLED_OUT_FORM')
        this.axiosGetAllLeaderboardResults()
      });
      // event.target.reset() clears the form once the item has been submitted
      event.target.reset();
      // now let's move onto the next state
      this.props.transition('API_DATABASE_CALL_COMPLETE')
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
            gravity={0.6}
            />
        </State>

        <State is={['gameOver', 'gameOverTransition', 'joinLeaderboard', 'leaderboard']}>
          <Confetti
            run={this.state.confettiFalling}
            numberOfPieces={600}
            // recycle={true}
            recycle={false}
            tweenDuration={100}
            opacity={0.6}
            gravity={0.08}
            />
        </State>

        <div className="twohue">


        <Header
          transition={this.props.transition}
          round={this.state.round}
          maxLossCount={this.state.maxLossCount}
          looseRound={this.state.looseRound}
          attempt={this.state.attempt}
          score={this.state.score}
          previousScore={this.state.previousScore}
          resetScoreForNextGame={this.resetScoreForNextGame}
          beginRoundSound={this.beginRoundSound}
          isAudioOn={this.state.isAudioOn}
          startGameClickHandler={this.startGameClickHandler}
          />

        <State is={['gameOver', 'gameOverTransition']}>
          <GameOverScreen
            score={this.state.score}
            leaderboardData={this.state.leaderboardData}
            transition={this.props.transition}
          />
        </State>

         <State is={['leaderboard', 'joinLeaderboard', 'leaderboardAPICall', 'noLeaderboardPlayAgain']}>
           <Leaderboard
             leaderboardData={this.state.leaderboardData}
             score={this.state.score}
             value={this.state.value}
             handleChange={this.handleChange}
             handleSubmit={this.handleSubmit}
             newLeaderboardInductee={this.state.newLeaderboardInductee}
             resetScoreForNextGame={this.resetScoreForNextGame}
             transition={this.props.transition}
           />
          </State>

          <div id="game-field">
            <State is={['homeScreenPractice','roundN', 'roundFinal', 'incrementRoundCounter', 'attemptN', 'checkColor', 'colorGuessCorrect', 'colorGuessIncorrect', 'checkSolution', 'playerWinsRound', 'playerLoosesRound', 'showSolution', 'playerWinsRoundFinalRound', 'playerLoosesRoundFinalRound', 'gameOver', 'gameOverTransition']}>
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
          </State>
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
