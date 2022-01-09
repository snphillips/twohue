import React, { useState, useEffect } from 'react';
import { withStateMachine, State } from 'react-automata';
import './App.css';
import Header from './components/Header';
import Byline from './components/Byline';
import GameField from './components/GameField';
import AudioToggle from './components/AudioToggle';
import ColorBubbleTray from './components/ColorBubbleTray';
import GameOverScreen from './components/GameOverScreen';
import Leaderboard from './components/Leaderboard';
import {Howl} from 'howler'; // Howler manages sound effects
import chroma from 'chroma-js'; // Color are all generated and mixed using chroma.js
import Confetti from 'react-confetti';
import axios from 'axios';
import statechart from './statechart';


// Leave both server addresses here in case you want to switch
let dataSource = "https://twohue-leaderboard-server.herokuapp.com/players";
// let dataSource = "http://localhost:3001/players";

let maxLossCount = 6;
let maxAttemptCount = 6;
let confettiRecycling = true;
let value;
let previsAudioOn;
let solutionColors;


function App(props) {
  const [round, setRound] = useState(0); 
  const [attempt, setAttempt] = useState(0); 
  const [looseRound, setLooseRound] = useState(0);
  const [previousScore, setPreviousScore] = useState(0); 
  const [score, setScore] = useState(0); 
  const [colorRound, setColorRound] = useState({}); 
  const [wrongColors, setWrongColors] = useState([]);
  const [allColorBubbles, setAllColorBubbles] = useState([]);
  const [numWrongColorBubbles, setNumWrongColorBubbles] = useState(0); 
  const [currentField, setCurrentField] = useState('leftField'); 
  const [currentFieldHover, setCurrentFieldHover] = useState('leftField');
  const [leftField, setLeftField] = useState({'backgroundColor': '#fff'}); 
  const [rightField, setRightField] = useState({'backgroundColor': '#fff'});
  const [isAudioOn, setIsAudioOn] = useState(false);
  const [confettiFalling, setConfettiFalling] = useState([]);
  const [playerWinRound, setPlayerWinRound] = useState([]);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [newLeaderboardInductee, setNewLeaderboardInductee] = useState('');
  const [leaderboardServerDown, setLeaderboardServerDown] = useState(false);



/*  =================================
State Machine On Entry States
All the component's methods whose names match the names
of actions and activities, are fired when the related
transition happen.

 Actions receive the state and the event as arguments.
 Find the "actions" & "activities" in statechart.js
 ================================= */
function readyAction() {
  console.log("readyAction() hello player")
  generateColorRound()
  // props.transition('READY')
 };

function homeScreenPractice(){
  console.log("homeScreenPractice() Do you want to practice?")
};

function startRoundN() {
  props.transition('FADE_IN_ROUND')
};

function roundN(){
  beginRoundSound()
  setConfettiFalling(false)
  setPlayerWinRound(false)
  setAttempt(0)
  props.transition('INCREMENT_ROUND_COUNTER')
};

function incrementRoundCounter() {
  if (looseRound >= maxLossCount) {
    props.transition("NO_MORE_ROUNDS")
  } else if (looseRound < maxLossCount)
  {
    setRound(round + 1)
    calculateNumWrongColorBubbles()
    props.transition("SET_UP_COLOR_ROUND")
  }
};

function setUpColorRound(){
  // Sarah pay attention to this.
  setLeftField({'backgroundColor': "#fff"})
  setRightField({'backgroundColor': "#fff"})
  generateColorRound()
  props.transition('PLAY_ROUND')
};

function playRound(){
  props.transition('ATTEMPT_N')
};

function attemptN() {
  if (attempt < maxAttemptCount) {
    props.transition("CHECK_SOLUTION")
  } else if (attempt >= maxAttemptCount) {
    props.transition("OUT_OF_ATTEMPTS")
  }
};

function checkSolution() {
  let leftFieldBackgroundColor = leftField.backgroundColor;
  let leftFieldHexColor = chroma(leftFieldBackgroundColor).hex();
  let rightFieldBackgroundColor = rightField.backgroundColor;
  let rightFieldHexColor = chroma(rightFieldBackgroundColor).hex();
  let solutionColors = colorRound.solutionColors;
  let attempts = attempt

  // Not enough trys: incorrect
  if (attempts === 1)
  {
    console.log("There has only been one guess. => INCORRECT_SOLUTION")
    props.transition("INCORRECT_SOLUTION")

  // correct
   } else if ( ( solutionColors.includes( leftFieldHexColor ) && solutionColors.includes( rightFieldHexColor )  )
    // the colors can't be the same on either side
    && ( leftFieldHexColor !== rightFieldHexColor  ))
   {
    props.transition("CORRECT_SOLUTION")
    console.log("CORRECT_SOLUTION")

   // incorrect
   } else {
    props.transition("INCORRECT_SOLUTION")
    console.log("INCORRECT attempts:", attempt)
   }
 };



 function playerWinsRound() {
  playWinSound();
  setPlayerWinRound(true)
  setConfettiFalling(true)
  playerWinsPoints()

  console.log("player wins round")

      let stateTransition = () => {
        if (looseRound < maxLossCount) {
          // console.log('NEXT_ROUND')
          props.transition('FADE_IN_ROUND')
        } else if (looseRound >= maxLossCount){
          console.log('NO_MORE_ROUNDS maxLossCount:', maxLossCount)
          props.transition('NO_MORE_ROUNDS')
        }
      }

    setTimeout(function() {
      // function to be executed after 2 seconds
      stateTransition()

    }, 1500);
};

function playerLoosesRound() {
  if (looseRound <= maxLossCount) {
   console.log("player looses round")
   playLoseSound()
   setLooseRound(looseRound + 1)
   props.transition('SHOW_SOLUTION')
 }
};

function showSolution() {
  console.log("showSolution", colorRound.solutionColor1, colorRound.solutionColor2)

  setLeftField({
    'backgroundColor': colorRound.solutionColor1,
    'animation': 'fadein 1.25s'
  });
  setRightField({
    'backgroundColor': colorRound.solutionColor2,
    'animation': 'fadein 1.25s'
  });

    let transition = () => {
      if (looseRound < maxLossCount) {
        console.log(`props.transition('NEXT_ROUND')`)
        props.transition('NEXT_ROUND')
      } else if (looseRound >= maxLossCount) {
        console.log(`props.transition('NO_MORE_ROUNDS')`)
        props.transition('NO_MORE_ROUNDS')
      }
    }

    setTimeout(function() {
    // Transition to next round after X seconds
    transition()
    }, 1000);
};


function gameOver() {
  gameOverChimes()
  setAttempt(0)
  setRound(0)
  setLooseRound(0)
  setConfettiFalling(true)
  props.transition('GAME_OVER_TRANSITION')
}


function gameOverTransition(){

     if (leaderboardServerDown === true) {
      console.log("leaderboard is not available")
      props.transition('DO_NOT_JOIN_LEADERBOARD');
     }


    let evaluateIfLeaderboardMaterial = () =>  {
      console.log("evaluateIfLeaderboardMaterial()", leaderboardData)
      // checking if the player's score in equal to or higher than
      // the lowest/last score in the array

      let leaderboardMembers = leaderboardData

      // What is smaller? 9 or the "array length - 1"?
      // Either pick the last item in the array, or the 10th item,
      // whichever is smaller.
      // We do this in case the array has fewer than 10 members.
      let lowestCurrentScoreIndex = Math.min(9, (leaderboardMembers.length - 1));
      let lowestCurrentScore = leaderboardMembers[lowestCurrentScoreIndex].score
      let score = score

      console.log("lowestCurrentScoreIndex:", lowestCurrentScoreIndex)
      console.log("lowestLeaderBoard score:", lowestCurrentScore)
      console.log("current score:", score)

      if (score >= lowestCurrentScore) {
        console.log("score is higher than lowestCurrentScore")
        props.transition('JOIN_LEADERBOARD');
        //
      } else {
        console.log("score is lower than lowestCurrentScore")
        props.transition('DO_NOT_JOIN_LEADERBOARD');
      }
    }

  setTimeout(function() {
    // Transition to leaderboard after X seconds
    evaluateIfLeaderboardMaterial()
  // }, 120000);
  }, 3000);

}


function joinLeaderboard(){
  setNewLeaderboardInductee("")
}

function leaderboard() {

}

function leaderboardAPICall() {
  // POST a new leaderboard inductee, then GET the results again.
  // The leaderboard only shows the top 10 results,
  // so the new inductee will appear in the list
  // axiosPostNewLeaderboardInductee( () => {
    // props.transition('FILLED_OUT_FORM')
    // axiosGetAllLeaderboardResults()
  // });
}

// *****************************************************
// ** End State Machine Functions **********************
// *****************************************************



// *****************************************************
// *****************************************************
// *****************************************************
// ** Regular Functions **************************
// *****************************************************
// *****************************************************
// *****************************************************

// Here's where the app begins.
// Run this only on first render (as evidences by empty array) 
  useEffect(() => {

    props.transition('READY')
    readyAction()
    // console.log("statechart:", statechart)
    console.log("HIHIHI props.machineState.value: ", props.machineState.value )
    // console.log("process.env.NODE_ENV:", process.env.NODE_ENV)
    axiosGetAllLeaderboardResults()
    
    // A couple things change depending on whether
    // we're in production vs. development
    if (process.env.NODE_ENV === 'production') {
      console.log = function () {};
      // setisAudioOn: true})
    } else if (process.env.NODE_ENV === 'development') {
      maxLossCount = 1;
      maxAttemptCount = 3;
      confettiRecycling = false;
    }
  }, [])
  
  
  useEffect(() => {
    console.log("props.machineState.value: ", props.machineState.value )
  })

  function calculateNumWrongColorBubbles(){

    let round = round
    let numberWrongColorBubbles = 0

    if (round <= 1) {
      numberWrongColorBubbles = 1
    } else if (round === 2) {
      numberWrongColorBubbles = 2
    } else if (round === 3) {
      numberWrongColorBubbles = 3
    } else if (round === 4) {
      numberWrongColorBubbles = 4
    } else if (round === 5) {
      numberWrongColorBubbles = 5
    } else if (round >= 6) {
      numberWrongColorBubbles = 6
    }

    setNumWrongColorBubbles(numberWrongColorBubbles);
  }

  function generateColorRound(numberWrongColorBubbles){
    console.log("generate color round")
    let soluColor1;
    let soluColor2;
    let targColor;
    let colorLightness = 29;
    // let numWrongColorBubbles = numberWrongColorBubbles; 
    // let numWrongColorBubbles;
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
      // ~~~~~~~~~~~~~~~~~~~~~~~~
      let newColorRound = {

        solutionColor1: soluColor1,
        solutionColor2: soluColor2,
        targetColor: targColor,

        /*
        Only create enough wrongColors to fill in the
        color bubbles. For instance, the practice round only
        has two bubbles total (therefore no wrong colors 
        are needed).
        numWrongColorBubbles tells us how many times we
        generate a random "wrong color" to push into

        getter methods are used to access the properties of an object
        */
        get wrongColors() {

          // first, empty the array of old colors
          wrongColorsArray = [];

          for (let i = numWrongColorBubbles; i > 0; i--) {
            wrongColorsArray.push(  chroma.random().hex()  );
          }
          return wrongColorsArray
        },
        
        
        get solutionColors() {
          return [chroma(newColorRound.solutionColor1).hex(), chroma(newColorRound.solutionColor2).hex()]
        },
        
        // Mix all the color bubbles together
        get allColorBubbles() { 
          console.log("solutionColors:", solutionColors)
          console.log("wrongColors:", wrongColors)

          // The concat() method is used to merge two or more arrays.
          // This method does not change the existing arrays, 
          // but instead returns a new array.
          // We're merging solutionColors & wrongColors
          return newColorRound.solutionColors.concat(newColorRound.wrongColors);
        }
      };
      console.log("wrongColors:", wrongColors)
      console.log("solutionColors:", solutionColors)
      console.log("newColorRound:", newColorRound)
      console.log("wrongColorArray:", wrongColorsArray)
      // ~~~~~~~~~~~~~~~~~~~~~~~~
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
          setAllColorBubbles(array)
      }

      shuffleColors(newColorRound.allColorBubbles)
      setColorRound(newColorRound)
      setWrongColors(wrongColorsArray)

  }



  function startGameClickHandler(){
    console.log("start game click handler")
    props.transition('START_GAME')
  }


//  ==================================================================
//  Hover handler for color bubbles - shows player which field of the
//  two fields is currently active. Note: we have to set the backgroundColor
//  otherwise it will revert to none.
//  ==================================================================
function currentFieldMouseEnter(){

if (confettiFalling === true) return

else if (currentField === 'leftField'){
setLeftField({
  "border": "8px solid #abb2b9",
  "backgroundColor": "color",
});

  } else {
    setRightField({
      "border": "8px solid #abb2b9",
      "backgroundColor": "color",
    });
  }
};

function currentFieldMouseLeave(){

if (confettiFalling === true) return

  if (currentField === 'leftField'){
    setLeftField({
      "border": "3px solid #abb2b9",
      "backgroundColor": "color"
    });
  } else {
    setRightField({
      "border": "3px solid #abb2b9",
      "backgroundColor": "color"
    });
  }
};


//  ====================================
//  Toggling between the left and right fields, to determine which
//  one will get filled in with color.
//  TODO: can you simplify this?
//  ====================================
function toggleLeftRightField(){
  if (currentField === "leftField") {
    setCurrentField("rightField")
    setCurrentFieldHover("rightField")
  } else {
    setCurrentField("leftField")
    setCurrentFieldHover("leftField")
  }
}

function incrementAttempt(){
  setAttempt(attempt + 1)
}

function playerWinsPoints() {
  let attempts =  attempt
  let score = score

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
  setScore(score)
}



//  ===================================
//  Click handler for the color bubbles at bottom of screen
//  ===================================
 // note: it has to be an arrow style function.
 function bubbleClickHandler(event){
  // guard clause to disable click handler if:
  // 1) the game is over,
  // 2) player is out of attempts,attemptN
  // 3) player has won the round,
  // 4) confetti is falling
  if (looseRound > (maxLossCount)) return
  if (attempt >= maxAttemptCount) return
  if (playerWinsRound === true) return
  if (confettiFalling === true) return

  setAttempt(attempt + 1);
  bubbleSound();
  toggleLeftRightField();
  // "event" is the click on a specific color bubble.
  // "currentTarget" is whatever color bubble is clicked.
  // "style.backgroundColor" takes whatever background color
  // the clicked color bubble has, and applies that to color field
  updateFieldColor(event.currentTarget.style.backgroundColor);
  props.transition('SELECT_COLOR');
};


  //  ==================================
  //  Filling in chosen color into left or right fields
  //  ==================================
  function updateFieldColor(color){
    if (looseRound > (maxLossCount)) return
    if (attempt >= maxAttemptCount) return
    if (currentField === 'leftField') {
     setLeftField( {'backgroundColor': color})
    } else {
      setRightField({'backgroundColor': color})
    }
  };

  function beginRoundSound(){
    // A guard clause if the user has clicked the audio off
    if (isAudioOn === false) {return}
    const sound = new Howl({
      src: ['/sound/finger-snap.wav']
    });
    sound.play()
  };


//  ==================================
//  audio button switch toggle
//  if audio is on the state of isAudioOn is true,
//  if audio is off the state of isAudioOn is false,
//  the ! is the oposite of what it currently is.
//  So, set the state to the 'oposite' of what it is.
//  ==================================
function soundButtonToggle() {
  setIsAudioOn(!isAudioOn)
}


  function bubbleSound(){
  // Using the Howler npm package for sound
  // There are two distinct sounds. One for the left, one for the right.
  // a guard clause if the player has toggled sound to be off
  if (isAudioOn === false) {return}

    if (currentField === "leftField") {
      const sound = new Howl({
      src: ['/sound/moogy73_perc14.wav']});
      sound.play()

    } else if (currentField === "rightField") {
      const sound = new Howl({
      src: ['/sound/moogy73_perc15.wav']});
      sound.play()
    }
 };

 function playWinSound(){
    // a guard clause if the player has toggled sound to be off
    if (isAudioOn === false) {return}
    const sound = new Howl({
      src: ['/sound/success.wav']
    });
    sound.play()
  };

  function playLoseSound(){
    // a guard clause if the player has toggled sound to be off
    if (isAudioOn === false) {return}
    const sound = new Howl({
      src: ['/sound/wrong-guess.wav']
    });
    sound.play()
  };

  function gameOverChimes(){
      // A guard clause if the user has clicked the audio off
    if (isAudioOn === false) {return}
    const sound = new Howl({
      src: ['/sound/windchimes.mp3']
    });
    sound.play()
  };

  function resetScoreForNextGame(){
    setScore(0)
    setLooseRound(0)
  }



//  ==================================
//  Leaderboard
//  ==================================
//  GET
//  ==================================

function axiosGetAllLeaderboardResults() {
      // axios.get(dataSource)
      //   .then( (response) => {
      //     setLeaderboardData(response.data)
      //     console.log("leaderboardData: ", leaderboardData)
      //   })
      //   .catch(function (error) {
      //     // If there's an error
      //     console.log("axiosGetAllLeaderboardResults() error:", error);
      //     setLeaderboardServerDown(true)
      //   });
    }


  //  ==================================================================
  //  POST
  //  As soon as the user interacts with the form, newTodo updates.
  //  The API call happens once the user clicks the 'submit' button.
  //  ==================================================================
  function axiosPostNewLeaderboardInductee() {
      // props.transition('FILLED_OUT_FORM')
      let string = newLeaderboardInductee;
      let length = 12;
      let trimmedString = string.substring(0, length);

      setNewLeaderboardInductee(  (trimmedString) => {
        console.log(string, length, trimmedString)
        console.log("Posting new result. name: ", newLeaderboardInductee, "score: ", score)
      })

      axios.post(dataSource, {
        player: newLeaderboardInductee || "enigma",
        score: score
      })
      .then(function (response) {
        console.log("leaderboard axios call response: ", response.data)
      })
      .then( () => {
        axiosGetAllLeaderboardResults()
      })
      .then( () => {
        console.log("after axiosGetAllLeaderboardResults()")
        props.transition('API_DATABASE_CALL_COMPLETE')
      })
      .catch(function (error) {
        console.log(error);
      });
    }

    function handleChange(event) {
      // console.log("leaderboard form value:",  event.target.value)
      // function setNewLeaderboardInductee (event.target.value) =>  {
        // console.log('newLeaderboardInductee: ', newLeaderboardInductee)
      // }
    }


    function handleSubmit(event) {
      event.preventDefault();
      props.transition('FILLED_OUT_FORM')
    }










// *****************************************************
// *****************************************************
// *****************************************************
// *****************************************************

  

  // for confetti to fall accross whole window,
  // if user resizes window
  // TODO: this alone does not work
  // could use a hook for this ***
  let width = window.innerWidth
  let height = window.innerHeight


    return (

      <div className="outer-div">

        <State is={['playerWinsRound']}>
          <Confetti
            width={width}
            height={height}
            run={confettiFalling}
            numberOfPieces={300}
            recycle={false}
            tweenDuration={100}
            colors={colorRound.allColorBubbles}
            opacity={0.6}
            gravity={0.6}
            />
        </State>

        <State is={['gameOver', 'gameOverTransition', 'joinLeaderboard', 'leaderboardAPICall', 'leaderboard']}>
          <Confetti
            width={width}
            height={height}
            run={confettiFalling}
            numberOfPieces={600}
            recycle={confettiRecycling}
            tweenDuration={100}
            opacity={0.6}
            gravity={0.08}
            />
        </State>

        <div className="twohue">


        <Header
          transition={props.transition}
          round={round}
          maxLossCount={maxLossCount}
          maxAttemptCount={maxAttemptCount}
          looseRound={looseRound}
          attempt={attempt}
          score={score}
          previousScore={previousScore}
          resetScoreForNextGame={resetScoreForNextGame}
          beginRoundSound={beginRoundSound}
          isAudioOn={isAudioOn}
          startGameClickHandler={startGameClickHandler}
        />

        <State is={['gameOver', 'gameOverTransition']}>
          <GameOverScreen
            score={score}
            leaderboardData={leaderboardData}
            transition={props.transition}
          />
        </State>

         <State is={['leaderboard', 'joinLeaderboard', 'leaderboardAPICall', 'noLeaderboardPlayAgain']}>
           <Leaderboard
             leaderboardData={leaderboardData}
             score={score}
             value={value}
             handleChange={handleChange}
             handleSubmit={handleSubmit}
             newLeaderboardInductee={newLeaderboardInductee}
             resetScoreForNextGame={resetScoreForNextGame}
             transition={props.transition}
           />
          </State>

          <div id="game-field">
            <State is={['homeScreenPractice','roundN', 'roundFinal', 'incrementRoundCounter', 'attemptN', 'checkColor', 'colorGuessCorrect', 'colorGuessIncorrect', 'checkSolution', 'playerWinsRound', 'playerLoosesRound', 'showSolution', 'playerWinsRoundFinalRound', 'playerLoosesRoundFinalRound', 'gameOver', 'gameOverTransition']}>
            <GameField
              colorRound={colorRound}
              currentField={currentField}
              leftField={leftField}
              rightField={rightField}
              />

            <ColorBubbleTray
              round={round}
              allColorBubbles={allColorBubbles}
              updateFieldColor={updateFieldColor}
              currentField={currentField}
              leftField={leftField}
              rightField={rightField}
              currentFieldMouseEnter={currentFieldMouseEnter}
              currentFieldMouseLeave={currentFieldMouseLeave}
              bubbleClickHandler={bubbleClickHandler}
              />
          </State>
         </div>


         <footer>

             <Byline />

             <AudioToggle
               soundButtonToggle={soundButtonToggle}
               isAudioOn={isAudioOn}
               />

         </footer>

      </div>
    </div>
    )
};

export default withStateMachine(statechart)(App);
