import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import './App.css';
import { Howl } from 'howler'; // Howler manages sound effects
import chroma from 'chroma-js'; // Color are all generated and mixed using chroma.js
import Confetti from 'react-confetti';
import axios from 'axios';
import LeftSidebar from './components/leftsidebar/LeftSidebar';
import Byline from './components/footer/Byline';
import GameField from './components/gameboard/GameField';
import AudioToggle from './components/footer/AudioToggle';
import ColorBubbleTray from './components/gameboard/ColorBubbleTray';
import MessageBoard from './components/gameboard/MessageBoard';
import Leaderboard from './components/gameboard/Leaderboard';
import useWindowSize from 'react-use/lib/useWindowSize'
import { GridLoader } from 'react-spinners';
import RightSidebar from './components/rightsidebar/RightSidebar';

// Leave both server addresses here in case you want to switch
let dataSource = 'https://twohue-leaderboard-server.herokuapp.com/players';
// let dataSource = 'http://localhost:3001/players';

let maxLossCount = 6;
let maxAttemptCount = 6;
let value;
// let attempts = 0;
// console.log("incrementRoundz:", incrementRoundz)


export default function App(props) {

   // gameStates: 
  // 'loading', 'homeScreenPractice'  'setUpRoundN', 
  // 'generateColorRound', 'roundN', 'attemptN', 'checkSolution',  
  // 'playerWins', 'playerLoosesShowSolution', 'showSolution', 
  // 'incrementRound', 'gameOver', 'gameOverTransition', 
  // 'joinLeaderboard','viewLeaderboard', 'leaderboardAPICall' 
  const [gameState, setGameState] = useState('homeScreenPractice');
  const [confettiRecycle, setConfettiRecycle] = useState(false);
  const [runRoundConfetti, setRunRoundConfetti] = useState(false);
  const [runGameOverConfetti, setrunGameOverConfetti] = useState(false);
  const [displayLeaderboardForm, setDisplayLeaderboardForm] = useState(true);
  const [displayGameField, setDisplayGameField] = useState(true);
  const [round, setRound] = useState(0);
  // const prevRound = useRef(0);
  const [attempt, setAttempt] = useState(0);
  const [lostRounds, setLostRounds] = useState(0);
  const prevLostRounds = useRef(0);
  const [score, setScore] = useState(0);
  const [colorRound, setColorRound] = useState({});
  const [allColorBubbles, setAllColorBubbles] = useState([]);
  const [currentField, setCurrentField] = useState('leftField');
  const [leftFieldStyle, setLeftFieldStyle] = useState({ backgroundColor: '#ffffff' });
  const [rightFieldStyle, setRightFieldStyle] = useState({ backgroundColor: '#ffffff' });
  const [isAudioOn, setIsAudioOn] = useState(false);
  const [newLeaderboardInductee, setNewLeaderboardInductee] = useState('');

  // const [wrongColors, setWrongColors] = useState([]);
  const [currentFieldHover, setCurrentFieldHover] = useState('leftField');
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [leaderboardServerDown, setLeaderboardServerDown] = useState(false);
  const [previousScore, setPreviousScore] = useState(0);
  // have to insert this during leaderboard api calls
  const [loadingSpinner, setLoadingSpinner] = useState(false);

  /*
  We can make a useEffect hook not run on initial render
  by creating a variable with the useRef hook to keep track
  of when the first render is done. Set the variable’s value
  to true initially. When the component is rendered the first time,
  set the variable to false.
  */
  const firstUpdate = useRef(true);

    if (state.value === 'homeScreenPracticeState') {
      // console.log("maxAttemptCount = 30")
      maxAttemptCount = 30; 
    } else {
      // console.log("maxAttemptCount = 6")
      maxAttemptCount = 6;
    }

    if (process.env.NODE_ENV === 'production') {
      setIsAudioOn(true);
    } else if (process.env.NODE_ENV === 'development') {
      maxLossCount = 2;
      maxAttemptCount = 4;
    }

  function initializeApp() {
    console.log('🪄 Im in initializeApp() state');
    axiosGetAllLeaderboardResults();
    setDisplayPlayAgainButton(false);
    setDisplayStartButton(true);
    setDisplayScoreBoard(false);
    setDisplayGameOverMessage(false);
    send('TO_HOMESCREEN_PRACTICE_STATE')
   };

   function homeScreenPractice() {
    console.log("🍄 I'm in homeScreenPractice() state")
    // Hard code practice colors
    setColorRound({
      solutionColor1: '#8cb5ef',
      solutionColor2: '#d79fb3',
      targetColor: '#7671a8',
      solutionColors: ['#8cb5ef','#d79fb3'],
      wrongColorsArray: []
    })
    setAllColorBubbles(['#8cb5ef','#d79fb3'])
    // game moves to next state in startGameClickHandler
  }

  function startGameClickHandler() {
    console.log('🏁 Im still in homeScreenPractice() state', state.context.roundz);
    // TODO: is this needed? Or does it reset when game starts?
    roundz = 0;
    setAttempt(0);
    setDisplayGameField(true);
    setRunRoundConfetti(false);
    setConfettiRecycle(false);
    setScore(0);
    setPreviousScore(0);
    setLostRounds(0);
    send('TO_INCREMENT_ROUND_STATE');
  };
  
  function incrementRound() {
    console.log("👆 I'm in incrementRoundState", roundz);
    // see useEffect for the state update 'TO_GENERATE_COLOR_ROUND_STATE'
    send({type: 'TO_GENERATE_COLOR_ROUND_STATE' });
  };

  useEffect( () => {
    // TODO - sadly the send({}) method results in stale data
    // generateColorRound() works as expected
    if (state.matches === "generateColorRoundState" ) {
      console.log("round changed. bleep", state.value)
      generateColorRound()
    }
    // send({type: 'TO_GENERATE_COLOR_ROUND_STATE'});
  }, [roundz])
  


  function generateColorRound() {

    // Guard clause
    // Don't run when we're in homeScreenPractice state
    if (state.matches('homeScreenPracticeState')) return;
    
    console.log("🎨 I'm in generateColorRound(). round:", roundz)

    let soluColor1;
    let soluColor2;
    let targColor;
    let colorLightness = 29;
    let wrongColorsArray = [];

    /* 
    =============================
    If the target color is too dark (like blackish),
    the round is nearly impossible to play.
    To solve this problem, we're not allowing rounds with very dark target color.
    Use a while-loop to genereate solution & target
    colors. Keep looping until it finds a solution
    that ISN'T too dark. We're using Chroma.js's .get('lab.l')
    to determine lightness.
    ============================= 
    */
    while (colorLightness <= 30) {
      soluColor1 = chroma.random().hex();
      soluColor2 = chroma.random().hex();
      targColor = chroma.blend(
        chroma(soluColor1).hex(),
        chroma(soluColor2).hex(),
        'multiply'
      );
      colorLightness = chroma(targColor).get('lab.l');
      // console.log('colorLightness: ', colorLightness)
    }

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
          numWrongColors tells us how many times we
          generate a random 'wrong color' to push into
          getter methods are used to access the properties of an object
          */
         get wrongColors() {
           // first, empty the array of old colors
           wrongColorsArray = [];

           let numWrongColors;
           (roundz <= 6 ? numWrongColors = roundz: numWrongColors = 6);
          //  console.log("🍱 in generate color round. We're on round:", round, "so make ", numWrongColors, " wrong colors.")   
           
        for (let i = numWrongColors; i > 0; i--) {

        wrongColorsArray.push(chroma.random().hex());
        }
        return wrongColorsArray;
      },

      get solutionColors() {
        return [
          chroma(newColorRound.solutionColor1).hex(),
          chroma(newColorRound.solutionColor2).hex(),
        ];
      },

      // Mix all the color bubbles together
      get allColorBubbles() {
        /* 
        The concat() method merges two or more arrays.
        This method does not change the existing arrays,
        but instead returns a new array.
        We're merging solutionColors & wrongColors
        */
        return newColorRound.solutionColors.concat(newColorRound.wrongColors);
      },
    };
    // ~~~~~~~~~~~~~~~~~~~~~~~~
    // ~~~~~~~~~~~~~~~~~~~~~~~~

    // The function that shuffles the allColorBubbles bubbles
    // so the first two bubbles aren't always the solution
    let shuffleColors = (array) => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * i);
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
      setAllColorBubbles(array);
    };

    shuffleColors(newColorRound.allColorBubbles);
    setColorRound(newColorRound);
    setWrongColors(wrongColorsArray);
    // send({type:'TO_PREPARE_ROUNDN_STATE'});
  };

  useEffect(() => {
    // TODO: find out why any sends({}) in useEffect not working
    // prepareRoundN();
    send({type:'TO_PREPARE_ROUNDN_STATE'});
  }, [colorRound])

  function prepareRoundN() {
    console.log("🛠 I'm in prepareRoundN() state");
    setRunRoundConfetti(false);
    beginRoundSound();
    setAttempt(0);
    // attempt = 0;
    setLeftFieldStyle({backgroundColor: '#ffffff'});
    setRightFieldStyle({backgroundColor: '#ffffff'});
    send({type:'TO_ATTEMPTN_STATE'});
  };
  
  function attemptN() {
    console.log("🚜 I'm in attemptN() state");
    // send({type:'TO_EVALUATE_ATTEMPTN_STATE'});
  };


  // =================================================
  // Check the solution after every attempt
  // =================================================
  useLayoutEffect(() => {
    generateColorRound();
    setGameState('roundN')
    console.log("🎡 Round updated. round: ",round)
  }, [round])
  
   // =================================================
   // Check the solution after every attempt
   // =================================================
   useEffect( () => {

    if (gameState === 'homeScreenPractice') {
      console.log("🎬 practice round. keep making attempts")
      return
    }

      let leftFieldBackgroundColor = leftFieldStyle.backgroundColor;
      let leftFieldHexColor = chroma(leftFieldBackgroundColor).hex();
      let rightFieldBackgroundColor = rightFieldStyle.backgroundColor;
      let rightFieldHexColor = chroma(rightFieldBackgroundColor).hex();
      let solutionColors = colorRound.solutionColors;
    
      // Not enough trys for solution
      if (attempt === 1) {
        console.log('👆 First guess.');
        send({type:'FIRST_GUESS_TO_ATTEMPTN_STATE'});
        // correct
      } else if (
        solutionColors.includes(leftFieldHexColor) &&
        solutionColors.includes(rightFieldHexColor) &&
        // the colors can't be the same on either side
        leftFieldHexColor !== rightFieldHexColor
      ) {
        console.log("😎 player makes correct guess - TO_PLAYER_WINS_CONFETTI_FALLS_STATE")
        // playerWinsConfettiFalls();
        send({type:'TO_PLAYER_WINS_CONFETTI_FALLS_STATE'});
  
        // incorrect
      } else {
        console.log("🙃 player makes wrong guess - TO_WRONG_GUESS_STATE")
        // wrongGuess() 
        send({type:'TO_WRONG_GUESS_STATE'});
      }
  }

  
  function wrongGuess() {
    console.log("👎 I'm in wrongGuessState attempt:", attempt, "/", maxAttemptCount)
    if (attempt < maxAttemptCount) {
      console.log("player may guess again, TO_ATTEMPTN_STATE")
      send({type:'WRONG_GUESS_TO_ATTEMPTN_STATE'});
    } else {
      console.log("😖 player out of guesses. Show solution. WRONG_GUESS_TO_PLAYER_LOOSES_ROUND_STATE")
      // playerLoosesShowSolution();
      send({type:'WRONG_GUESS_TO_PLAYER_LOOSES_ROUND_STATE'});
    }
  }

  //  ===================================
  //  Player Wins Round
  //  ===================================
  function playerWinsConfettiFalls() {
    console.log("🦄 I'm in playerWinsConfettiFallsState");
    setRunRoundConfetti(true);
    playWinSound();
    increasePlayerScore();
    // After x seconds, proceed to incrementRoundN()
    setTimeout(function () {
      send({type:'TO_INCREMENT_ROUND_STATE'});
      // incrementRound();
    }, 3000);
  };

  useEffect( () => {
    console.log("🎊 runRoundConfetti updates", runRoundConfetti )
  }, [runRoundConfetti])

  //  ===================================
  //  Player Looses Round
  //  ===================================
  function playerLoosesShowSolution() {
    console.log('😭 player looses round');
    playLoseSound();
    showSolution();
    setLostRounds(lostRounds => lostRounds + 1);
  }
  
  function showSolution() {
    console.log('showSolution', colorRound.solutionColor1, colorRound.solutionColor2);
    
    setLeftFieldStyle({
      backgroundColor: colorRound.solutionColor1,
      animation: 'fadein 1.25s',
    });
    setRightFieldStyle({
      backgroundColor: colorRound.solutionColor2,
      animation: 'fadein 1.25s',
    });
  }

  useEffect( () => {
    // Do not proceed if state is "homescreenpractice"
    if (state.value === "homeScreenPracticeState") {return}
    
    // Do not proceed if prevLostRounds is equal to lostRounds
    if (prevLostRounds.current === lostRounds) {return}
   
    console.log('lostRounds useEffect. Triggers b/c lostRounds changed')
    // Player lost this round. 
    // Transition to either the next round or game over after X seconds
    setTimeout(function () {
      console.log("prevLostRounds", prevLostRounds.current, "lostRounds:", lostRounds, "maxLossCount:", maxLossCount)
      if (lostRounds < maxLossCount) {
        console.log(`🌗 Set up next round`);
        // incrementRoundN(
        // send({type:'TO_CLEAR_ROUND_STATE'});
        send({type:'TO_INCREMENT_ROUND_STATE'});
      } else if (lostRounds >= maxLossCount) {
        console.log(`🌑 Transition to gameOver()`);
        // gameOver()
        send({type:'TO_GAMEOVER_STATE'});
      }
    }, 2000);

  }, [lostRounds])
   

  function gameOver() {
    setGameState('gameOver');
    gameOverChimes();
    setrunGameOverConfetti(true);
    setConfettiRecycle(true);
    gameOverTransition();
  }

  function gameOverTransition() {
    if (leaderboardServerDown === true) {
      console.log('🚨 leaderboard is not available');
    }

    let evaluateIfLeaderboardMaterial = () => {
      console.log('evaluateIfLeaderboardMaterial()', leaderboardData);
      // checking if the player's score in equal to or higher than
      // the lowest/last score in the array

      let leaderboardMembers = leaderboardData;

     /*
      What is smaller? 9 or the 'array length - 1'?
      Either pick the last item in the array, or the 10th item,
      whichever is smaller.
      We do this in case the array has fewer than 10 members.
      */
      let lowestCurrentScoreIndex = Math.min(9, leaderboardMembers.length - 1);
      let lowestCurrentScore =
        leaderboardMembers[lowestCurrentScoreIndex].score;
      // let score = score;

      console.log('lowestCurrentScoreIndex:', lowestCurrentScoreIndex);
      console.log('lowestLeaderBoard score:', lowestCurrentScore);
      console.log('current score:', score);

      if (score >= lowestCurrentScore) {
        console.log('score is higher than lowestCurrentScore');
        joinLeaderboard()
      } else {
        console.log('score is lower than lowestCurrentScore');
      }
    };
    evaluateIfLeaderboardMaterial();
  }

  function joinLeaderboard() {
    setDisplayGameField(false);
    setGameState('joinLeaderboard');
    setNewLeaderboardInductee('');
  }

  function leaderboardAPICall() {
    // POST a new leaderboard inductee, then GET the results again.
    // The leaderboard only shows the top 10 results,
    // so the new inductee will appear in the list
    axiosPostNewLeaderboardInductee( () => {
      // props.transition('FILLED_OUT_FORM')
      console.log('🫒 displayLeaderboardForm: ', displayLeaderboardForm)
      axiosGetAllLeaderboardResults();
  
    });
  }
 
  function generateColorRound() {
    // No need to generate colors for practice.
    // Practice colors are hard-coded
    if (gameState === 'homeScreenPractice') {return}
    console.log("🎨 generate color round. round:", round, gameState)
    if (gameState !== 'homeScreenPractice' && gameState !== 'loading') {
      console.log('gameState isnt loading or practice, right?', gameState)
      setGameState('generateColorRound')
    }
    let soluColor1;
    let soluColor2;
    let targColor;
    let colorLightness = 29;
    let wrongColorsArray = [];

    /* 
    =============================
    If the target color is too dark (like blackish),
    the round is nearly impossible to play.
    To solve this problem, we're not allowing rounds with 
    a very dark target color.
    
    Use a while-loop to genereate solution & target
    colors. Keep looping until it finds a solution
    that ISN'T too dark. We're using Chroma.js's .get('lab.l')
    to determine lightness.
    ============================= 
    */
    while (colorLightness <= 30) {
      soluColor1 = chroma.random().hex();
      soluColor2 = chroma.random().hex();
      targColor = chroma.blend(
        chroma(soluColor1).hex(),
        chroma(soluColor2).hex(),
        'multiply'
      );
      colorLightness = chroma(targColor).get('lab.l');
      // console.log('colorLightness: ', colorLightness)
    }

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
          numWrongColors tells us how many times we
          generate a random 'wrong color' to push into
          getter methods are used to access the properties of an object
          */
         get wrongColors() {
           // first, empty the array of old colors
           wrongColorsArray = [];

           let numWrongColors;
           (round <= 6 ? numWrongColors = round: numWrongColors = 6);   
           
        for (let i = numWrongColors; i > 0; i--) {

        wrongColorsArray.push(chroma.random().hex());
        }
        return wrongColorsArray;
      },

      get solutionColors() {
        return [
          chroma(newColorRound.solutionColor1).hex(),
          chroma(newColorRound.solutionColor2).hex(),
        ];
      },

      // Mix all the color bubbles together
      get allColorBubbles() {
        // The concat() method merges two or more arrays.
        // This method does not change the existing arrays,
        // but instead returns a new array.
        // We're merging solutionColors & wrongColors
        return newColorRound.solutionColors.concat(newColorRound.wrongColors);
      },
    };
    // ~~~~~~~~~~~~~~~~~~~~~~~~
    // ~~~~~~~~~~~~~~~~~~~~~~~~

    // The function that shuffles the allColorBubbles bubbles
    // so the first two bubbles aren't always the solution
    let shuffleColors = (array) => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * i);
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
      setAllColorBubbles(array);
    };

    shuffleColors(newColorRound.allColorBubbles);
    setColorRound(newColorRound);
    // setWrongColors(wrongColorsArray);
  }



   /* 
   ============================================
   Hover handler for color bubbles - shows player which 
   field of the two fields is currently active.
   Note: we have to set the backgroundColor otherwise
   it will revert to none.
   ============================================
   */
  function currentFieldMouseEnter() {
    if (state.value === 'playerWinsState') return;
    else if (currentField === 'leftField') {
      setLeftFieldStyle({
        border: '8px solid #abb2b9',
        backgroundColor: 'color',
      });
    } else {
      setRightFieldStyle({
        border: '8px solid #abb2b9',
        backgroundColor: 'color',
      });
    }
  }

  function currentFieldMouseLeave() {
    if (state.value === 'playerWinsState') return;

    if (currentField === 'leftField') {
      setLeftFieldStyle({
        border: '3px solid #abb2b9',
        backgroundColor: 'color',
      });
    } else {
      setRightFieldStyle({
        border: '3px solid #abb2b9',
        backgroundColor: 'color',
      });
    }
  }

   /* ====================================
   Toggling between the left and right fields,
   to determine which one will get filled in with color.
   ==================================== */
  function toggleLeftRightField() {
    if (currentField === 'leftField') {
      setCurrentField('rightField');
      setCurrentFieldHover('rightField');
    } else {
      setCurrentField('leftField');
      setCurrentFieldHover('leftField');
    }
  }

  function increasePlayerScore() {
    // Update previous score for react-countup
    // React-countup is the cute score incrementing animation
    setPreviousScore(score)
    if (attempt === 6) {
      setScore(score => score + 1);
    } else if (attempt === 5) {
      setScore(score => score + 2);
    } else if (attempt === 4) {
      setScore(score => score + 3);
    } else if (attempt === 3) {
      setScore(score => score + 4);
    } else if (attempt === 2) {
      setScore(score => score + 6);
    }
  }

  //  ===================================
  //  Click handler for the color bubbles at bottom of screen
  //  ===================================
  function bubbleClickHandler(event) {
    
    /*
    guard clause to disable click handler if:
    1) the game is over,
    2) player is out of attempts,
    3) player has won the round,
    4) player has lost the round
    */
    if ((gameState === "gameOver") ||
        (gameState === 'playerWins') ||
        (gameState === 'setUpRoundN') || 
        (attempt >= maxAttemptCount)) {
          console.log("✋ click handler disabled")
          // TODO: how to disable/change the hover effect
          // Well, disabling is working, but removing the disabled
          // effect is where I'm stuck
          // document.getElementById(event.currentTarget.id).classList.add('disable-click');
          return
        }
   
    // No need to increment attempts during practice
    if (gameState !== 'homeScreenPractice') {
      setAttempt(attempt + 1);
    }

    bubbleSound();
    toggleLeftRightField();
    /*
    'event' is the click on a specific color bubble.
    'currentTarget' is whatever color bubble is clicked.
    'style.backgroundColor' takes whatever background color
    the clicked color bubble has, and applies that to color field
    */
    updateFieldColor(event.currentTarget.style.backgroundColor);
  }

  //  ==================================
  //  Filling in chosen color into left or right fields
  //  ==================================
  function updateFieldColor(color) {
    if (lostRounds > maxLossCount) return;
    if (attempt >= maxAttemptCount) return;
    if (currentField === 'leftField') {
      setLeftFieldStyle({ backgroundColor: color });
    } else {
      setRightFieldStyle({ backgroundColor: color });
    }
  }

  function beginRoundSound() {
    // Guard clause if player has toggled sound to be off
    if (isAudioOn === false) return;
    const sound = new Howl({
      src: ['/sound/finger-snap.wav'],
    });
    sound.play();
  }

   /* 
   ==================================
   🎶 audio button switch toggle
   if audio is on the state of isAudioOn is true,
   if audio is off the state of isAudioOn is false,
   the ! is the oposite of what it currently is.
   So, set the state to the 'oposite' of what it is.
   ==================================
   */
  function soundButtonToggle() {
    setIsAudioOn(!isAudioOn);
  }

  function bubbleSound() {
    /*
    Using the Howler npm package for sound
    There are two distinct bubble sounds: 
    One for the left, one for the right.
    */
    
    // Guard clause if player has toggled sound to be off
    if (isAudioOn === false) return;

    if (currentField === 'leftField') {
      const sound = new Howl({
        src: ['/sound/moogy73_perc14.wav'],
      });
      sound.play();
    } else if (currentField === 'rightField') {
      const sound = new Howl({
        src: ['/sound/moogy73_perc15.wav'],
      });
      sound.play();
    }
  }

  function playWinSound() {
    // Guard clause if player has toggled sound to be off
    if (isAudioOn === false) return;
    const sound = new Howl({
      src: ['/sound/success.wav'],
    });
    sound.play();
  }

  function playLoseSound() {
    // Guard clause if player has toggled sound to be off
    if (isAudioOn === false) return;
    const sound = new Howl({
      src: ['/sound/wrong-guess.wav'],
    });
    sound.play();
  }

  function gameOverChimes() {
    // Guard clause if player has toggled sound to be off
    if (isAudioOn === false) return;
    const sound = new Howl({
      src: ['/sound/windchimes.mp3'],
    });
    sound.play();
  }

  //  ==================================
  //  Leaderboard
  //  ==================================
  //  GET
  //  ==================================

  function axiosGetAllLeaderboardResults() {
    axios.get(dataSource)
      .then( (response) => {
        setLeaderboardData(response.data);
        console.log('leaderboardData: ', leaderboardData);
      })
      .catch(function (error) {
        // If there's an error
        console.log('axiosGetAllLeaderboardResults() error:', error);
        setLeaderboardServerDown(true)

        if (leaderboardServerDown === true) {
         console.log("leaderboard down")
        }
      });
  }

  //  =================================
  //  POST
  //  =================================
  function axiosPostNewLeaderboardInductee() {
    // props.transition('FILLED_OUT_FORM')
    let string = newLeaderboardInductee;
    let length = 12;
    let trimmedString = string.substring(0, length);

    setNewLeaderboardInductee((trimmedString) => {
      console.log(string, length, trimmedString);
      console.log(
        'Posting new result. name: ',
        newLeaderboardInductee,
        'score: ',
        score
      );
    });

    axios
      .post(dataSource, {
        player: newLeaderboardInductee || 'bubble boy',
        score: score,
      })
      .then(function (response) {
        console.log('leaderboard axios call response: ', response);
      })
      .then(() => {
        axiosGetAllLeaderboardResults();
      })
      .then(() => {
        console.log('after axiosGetAllLeaderboardResults()');
        // props.transition('API_DATABASE_CALL_COMPLETE');
        // TODO: sarah what happens here?
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  function handleChange(event) {
    console.log('leaderboard form value:',  event.target.value)
    setNewLeaderboardInductee(event.target.value) 
    console.log('newLeaderboardInductee: ', newLeaderboardInductee)
  }
  
  function handleSubmit(event) {
    event.preventDefault();
    // props.transition('FILLED_OUT_FORM');
    // handleChange(event.target.value);
    leaderboardAPICall( () => {
      // TODO: find a way to hide leaderboard form.
      // it's not working here.
      setDisplayLeaderboardForm(false);
    });
  }
  


  // *****************************************************
  // *****************************************************
  // *****************************************************
  // *****************************************************

  // Confetti falls accross whole window
  // even if window is resized
  const { width, height } = useWindowSize()

  return (
    <div className='outer-div'>

      <div className='win-round-confetti'>
        <Confetti
          width={width}
          height={height}
          numberOfPieces={300}
          run={runRoundConfetti}
          recycle={false}
          tweenDuration={100}
          colors={colorRound.allColorBubbles}
          opacity={0.6}
          gravity={0.6}
          // This resets confetti so it's ready to fall 
          // next time the user wins
          onConfettiComplete={confetti => {
            confetti.reset()
          }}
        />
      </div>

      <div className='win-game-confetti'>
        <Confetti
          width={width}
          height={height}
          run={runGameOverConfetti}
          numberOfPieces={600}
          recycle={confettiRecycle}
          tweenDuration={100}
          opacity={0.6}
          gravity={0.08}
          />
      </div>

      <div className='twohue'>
      <div className='gamefield-top'>
      <aside className='left-side'>
        <LeftSidebar
          style={{
            display: 'block',
            width: '100%',
          }}
          score={score}
          leaderboardData={leaderboardData}
          // displayGameOverMessage={displayGameOverMessage}
          gameState={gameState}
          />
      </aside>
      <main>
        <MessageBoard
          gameState={gameState}
          />

          <Leaderboard
            leaderboardData={leaderboardData}
            score={score}
            value={value}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            newLeaderboardInductee={newLeaderboardInductee}
            loadingSpinner={loadingSpinner}
            gameState={gameState}
            />
      
      {displayGameField &&
        <div id='game-field'>
          <GameField
            colorRound={colorRound}
            currentField={currentField}
            leftFieldStyle={leftFieldStyle}
            rightFieldStyle={rightFieldStyle}
            gameState={gameState}
            />
        </div>
      }
      </main>
      <aside className='right-side'>
        <RightSidebar
          startGameClickHandler={startGameClickHandler}
          setUpRoundN={setUpRoundN}
          round={round}
          maxLossCount={maxLossCount}
          maxAttemptCount={maxAttemptCount}
          lostRounds={lostRounds}
          attempt={attempt}
          score={score}
          previousScore={previousScore}
          setPreviousScore={setPreviousScore}
          beginRoundSound={beginRoundSound}
          isAudioOn={isAudioOn}
          startGameClickHandler={startGameClickHandler}
          gameState={gameState}
        />
      </aside>

    </div>
    {displayGameField &&
    <div 
      className='gamefield-bottom'
      style={{
        display: 'block',
        // border: '1px solid gold'
      }}
      >
        <ColorBubbleTray
          allColorBubbles={allColorBubbles}
          currentField={currentField}
          // leftFieldStyle={leftFieldStyle}
          // rightFieldStyle={rightFieldStyle}
          currentFieldMouseEnter={currentFieldMouseEnter}
          currentFieldMouseLeave={currentFieldMouseLeave}
          bubbleClickHandler={bubbleClickHandler}
          gameState={gameState}
          />
    </div>
   }
   <div style={{display: 'flex', flexGrow: '1'}}> 
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
  );
}