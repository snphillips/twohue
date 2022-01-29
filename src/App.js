import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import './App.css';
import { Howl } from 'howler'; // Howler manages sound effects
import chroma from 'chroma-js'; // Color are all generated and mixed using chroma.js
import Confetti from 'react-confetti';
import axios from 'axios';
import LeftSidebar from './components/leftsidebar/LeftSidebar';
import Byline from './components/footer/Byline';
import GameField from './components/GameField';
import AudioToggle from './components/footer/AudioToggle';
import ColorBubbleTray from './components/ColorBubbleTray';
import MessageBoard from './components/MessageBoard';
import Leaderboard from './components/Leaderboard';
import StartButtons from './components/StartButtons';
import Scoreboard from './components/Scoreboard';
import useWindowSize from 'react-use/lib/useWindowSize'
import twohueMachine from './twohueMachine';
import { useMachine } from '@xstate/react';
import { Machine } from 'xstate';
import { GridLoader } from 'react-spinners';

// Leave both server addresses here in case you want to switch
let dataSource = 'https://twohue-leaderboard-server.herokuapp.com/players';
// let dataSource = 'http://localhost:3001/players';

let maxLossCount = 6;
let maxAttemptCount = 6;
let value;
let round = 0;


export default function App(props) {

  const [state, send] = useMachine(twohueMachine.withConfig({
    actions:{
      initializeApp: initializeApp,
      homeScreenPractice: homeScreenPractice,
      startGame: startGame,
      incrementRound: incrementRound,
      prepareRoundN: prepareRoundN,
      generateColorRound: generateColorRound,
      attemptN: attemptN,
      evaluateAttempt: evaluateAttempt,
      playerWinsConfettiFalls: playerWinsConfettiFalls,
      wrongGuess: wrongGuess,
      playerLoosesShowSolution: playerLoosesShowSolution,
      gameOver: gameOver,
      leaderboard: leaderboard,
      noLeaderboard: noLeaderboard,
    }
  }
  ));

  console.log("🚦 state.value:", state.value)
  // console.log("twohueMachine.transition('initializeApp', 'TO_GENERATE_COLOR_ROUND').value",  twohueMachine.transition('initializeApp', 'TO_GENERATE_COLOR_ROUND').value   );

  const [confettiRecycle, setConfettiRecycle] = useState(false);
  const [runRoundConfetti, setRunRoundConfetti] = useState(false);
  const [runGameOverConfetti, setrunGameOverConfetti] = useState(false);
  const [displayScoreBoard, setDisplayScoreBoard] = useState(false);
  const [displayStartButton, setDisplayStartButton] = useState(true);
  const [displayIntroMessage, setDisplayIntroMessage] = useState(true);
  const [displayIntroAnimation, setDisplayIntroAnimation] = useState(true);
  const [displayGameOverMessage, setDisplayGameOverMessage] = useState(false);
  const [displayPlayAgainButton, setDisplayPlayAgainButton] = useState(false);
  const [displayGameOverConfetti, setDisplayGameOverConfetti] = useState(false);
  const [displayLeaderboard, setDisplayLeaderboard] = useState(false);
  const [displayLeaderboardForm, setDisplayLeaderboardForm] = useState(true);
  const [displayGameField, setDisplayGameField] = useState(true);
  // const [round, setRound] = useState(0);
  const prevRound = useRef(0);
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

  const [wrongColors, setWrongColors] = useState([]);
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
    send({ type: 'TO_HOMESCREEN_PRACTICE_STATE' })
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
    // game moves to next state when user clicks start button
  }

  function startGame() {
    console.log('🏁 Im still in homeScreenPractice() state');
    // setRound(0);
    round = 0;
    setDisplayGameField(true);
    setDisplayScoreBoard(true);
    setDisplayLeaderboard(false);
    setDisplayIntroAnimation(false);
    setDisplayStartButton(false);
    setDisplayPlayAgainButton(false);
    setDisplayIntroMessage(false);
    setDisplayGameOverConfetti(false);
    setDisplayGameOverMessage(false);
    setRunRoundConfetti(false);
    setConfettiRecycle(false);
    setScore(0);
    setPreviousScore(0);
    setLostRounds(0);
    setAttempt(0);
    send({type:'TO_INCREMENT_ROUND_STATE'});
  };
  
  function incrementRound() {
    console.log("👆 I'm in incrementRoundState");
    // setRound(round => round + 1);
    round = round + 1;
    // see useEffect for the state update
    send({type: 'TO_GENERATE_COLOR_ROUND_STATE' });
  };
  
  // useEffect( () => {
  //   // we do not need to generate color round for practice
  //   // as the practice round colors are hard-coded
  //   if (round === 0) {
  //     console.log("round is 0. Do not generate color round", round)
  //     return
  //   }
    
  //   console.log('🍩 round changed so useEffect triggers')
  //   // TODO: why does transitioning with generateColorRound() work,
  //   // but send({}) does not?
  //   // send({}) does send along to generateColorRound(), but 
  //   // not at the right time. 
  //   send({type: 'TO_GENERATE_COLOR_ROUND_STATE' });
  //   // generateColorRound();
  // }, [round])

  function generateColorRound() {
    console.log("🎨 I'm in generateColorRound(). round:", round)

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
           (round <= 6 ? numWrongColors = round: numWrongColors = 6);
           console.log("🍱 in generate color round. We're on round:", round, "so make ", numWrongColors, " wrong colors.")   
           
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
    setWrongColors(wrongColorsArray);
    send({type:'TO_PREPARE_ROUNDN_STATE'});
  };

  function prepareRoundN() {
    console.log("🛠 I'm in prepareRoundN() state");
    setRunRoundConfetti(false);
    beginRoundSound();
    setAttempt(0);
    setLeftFieldStyle({backgroundColor: '#ffffff'});
    setRightFieldStyle({backgroundColor: '#ffffff'});
    send({type:'TO_ATTEMPTN_STATE'});
  };
  
  function attemptN() {
    console.log("🚜 I'm in attemptN() state");
    send({type:'TO_EVALUATE_ATTEMPT_STATE'});
  };


  // =================================================
  // Check the solution after every attempt
  // =================================================
  useEffect( () => {
   // Don't run on first render (firstUpdate)
   if (firstUpdate.current) {
     firstUpdate.current = false;
     return;
   }
   evaluateAttempt()
 }, [attempt])


  function evaluateAttempt() {
     console.log("🌡 I'm in evaluateAttemptState state")

     // No need to evaluate attempt when in practice round
     if (state.value === 'homeScreenPracticeState') {
      console.log("🎬 practice round. keep making attempts")
      return
    }
    // Guard clause: no need to evaluate attempt
    // when attempt resets to 0
    if (attempt === 0 ) {
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
        // correct
      } else if (
        solutionColors.includes(leftFieldHexColor) &&
        solutionColors.includes(rightFieldHexColor) &&
        // the colors can't be the same on either side
        leftFieldHexColor !== rightFieldHexColor
      ) {
        console.log("😎 player makes correct guess - TO_PLAYER_WINS_CONFETTI_FALLS_STATE")
        send({type:'TO_PLAYER_WINS_CONFETTI_FALLS_STATE'});
        // playerWinsConfettiFalls();
  
        // incorrect
      } else {
      //  wrongGuess()
      console.log("🙃 player makes wrong guess - TO_WRONG_GUESS_STATE")
       send({type:'TO_WRONG_GUESS_STATE'});
      }
  }

  
  function wrongGuess() {
    console.log("👎 I'm in wrongGuessState")
    if (attempt < maxAttemptCount) {
      console.log("player may guess again, TO_ATTEMPTN_STATE")
      send({type:'TO_ATTEMPTN_STATE'});
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
    // setTimeout(function () {
    //   send({type:'TO_INCREMENT_ROUND_STATE'});
    //   // incrementRound();
    // }, 3000);
  };

  useEffect( () => {
    // console.log("🎊 🎊 🎊 🎊 runRoundConfetti updates", runRoundConfetti )
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
    gameOverChimes();
    setDisplayScoreBoard(false);
    setDisplayGameOverMessage(true);
    setDisplayPlayAgainButton(true);
    setrunGameOverConfetti(true);
    setDisplayGameOverConfetti(true);
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

  function leaderboard() {
    // TODO: reconcile leaderboard and joinLeaderboard
  }

  function noLeaderboard() {
    // TODO figure this out
  }

  function joinLeaderboard() {
    setDisplayGameField(false);
    setDisplayGameOverMessage('none');
    setDisplayLeaderboard(true);
    setDisplayLeaderboardForm(true);
    setNewLeaderboardInductee('');
  }

  function leaderboardAPICall() {
    setDisplayLeaderboardForm(false);
    // POST a new leaderboard inductee, then GET the results again.
    // The leaderboard only shows the top 10 results,
    // so the new inductee will appear in the list
    axiosPostNewLeaderboardInductee( () => {
      // props.transition('FILLED_OUT_FORM')
      console.log('🫒 displayLeaderboardForm: ', displayLeaderboardForm)
      axiosGetAllLeaderboardResults();
  
    });
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
   to determine which
   one will get filled in with color.
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

  function incrementAttempt() {
    setAttempt(attempt => attempt + 1);
  }

  function increasePlayerScore() {
    // update previous score for react-countup
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
    console.log("🧚‍♀️ bubble click handler")
    // guard clauses to disable click handler if:
    // 1) the game is over,
    // 2) player is out of attempts,attemptN
    // 3) player has won the round,
    if ((state.value === "gameOverState") ||
       (state.value === 'playerWinsState')) {
      console.log("✋ click handler disabled")
      return
    }
    if (attempt >= maxAttemptCount) {
      console.log("✋ attempt >= maxAttemptCount - click handler disabled")
      return
    };

    // Don't count attempts if user is practicing
    if (state.value === 'homeScreenPracticeState') {
      setAttempt(0)
    } else {
      setAttempt(attempt + 1);
    }

    bubbleSound();
    toggleLeftRightField();
    // 'event' is the click on a specific color bubble.
    // 'currentTarget' is whatever color bubble is clicked.
    // 'style.backgroundColor' takes whatever background color
    // the clicked color bubble has, and applies that to color field
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
    // A guard clause if the user has clicked the audio off
    if (isAudioOn === false) {
      return;
    }
    const sound = new Howl({
      src: ['/sound/finger-snap.wav'],
    });
    sound.play();
  }

  //  ==================================
  //  🎶 audio button switch toggle
  //  if audio is on the state of isAudioOn is true,
  //  if audio is off the state of isAudioOn is false,
  //  the ! is the oposite of what it currently is.
  //  So, set the state to the 'oposite' of what it is.
  //  ==================================
  function soundButtonToggle() {
    setIsAudioOn(!isAudioOn);
  }

  function bubbleSound() {
    // Using the Howler npm package for sound
    // There are two distinct sounds. One for the left, one for the right.
    // a guard clause if the player has toggled sound to be off
    if (isAudioOn === false) {
      return;
    }

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
    // a guard clause if the player has toggled sound to be off
    if (isAudioOn === false) {
      return;
    }
    const sound = new Howl({
      src: ['/sound/success.wav'],
    });
    sound.play();
  }

  function playLoseSound() {
    // a guard clause if the player has toggled sound to be off
    if (isAudioOn === false) {
      return;
    }
    const sound = new Howl({
      src: ['/sound/wrong-guess.wav'],
    });
    sound.play();
  }

  function gameOverChimes() {
    // A guard clause if the user has clicked the audio off
    if (isAudioOn === false) {
      return;
    }
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
      <div 
        className='gamefield-top'
        style={{
          display: 'flex',
          flexDirection: 'row'
        }}
      >
      <aside 
        className='left-side' 
        style={{
          display: 'block',
          width: '20%',
          flexGrow: 1,
          flexBasis: 'auto'
        }}
        >
        <LeftSidebar
          style={{
            display: 'block',
            width: '100%',
            height: '100%'
          }}
          score={score}
          leaderboardData={leaderboardData}
          displayGameOverMessage={displayGameOverMessage}
          />
      </aside>
      <main
        style={{
          display: 'block',
          width: '60%',
          flexGrow: 3,
          flexBasis: 'auto'
        }}
        
        >
        <MessageBoard
          // transition={props.transition}
          displayIntroMessage={displayIntroMessage}
          />

          {/* <GameOverMessage
          /> */}

          <Leaderboard
            leaderboardData={leaderboardData}
            score={score}
            value={value}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            newLeaderboardInductee={newLeaderboardInductee}
            loadingSpinner={loadingSpinner}
            displayLeaderboard={displayLeaderboard}
            displayLeaderboardForm={displayLeaderboardForm}
            />
      
      {displayGameField &&
        <div 
          id='game-field'
          style={{
          }}
        >
            <GameField
              colorRound={colorRound}
              currentField={currentField}
              leftFieldStyle={leftFieldStyle}
              rightFieldStyle={rightFieldStyle}
              />

        </div>
      }
      </main>
      <aside 
        className='right-side'
        style={{
          display: 'block',
          width: '20%',
          flexGrow: 1,
          flexBasis: 'auto'
        }}
      >
      <StartButtons
          displayStartButton={displayStartButton}
          displayPlayAgainButton={displayPlayAgainButton}
          startGame={startGame}
          prepareRoundN={prepareRoundN}
        />

        <Scoreboard 
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
          startGame={startGame}
          displayScoreBoard={displayScoreBoard}
          displayStartButton={displayStartButton}
          displayPlayAgainButton={displayPlayAgainButton}
          prepareRoundN={prepareRoundN}
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
            round={round}
            allColorBubbles={allColorBubbles}
            updateFieldColor={updateFieldColor}
            currentField={currentField}
            leftFieldStyle={leftFieldStyle}
            rightFieldStyle={rightFieldStyle}
            currentFieldMouseEnter={currentFieldMouseEnter}
            currentFieldMouseLeave={currentFieldMouseLeave}
            bubbleClickHandler={bubbleClickHandler}
            displayIntroAnimation={displayIntroAnimation}
            />

    </div>
   }
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