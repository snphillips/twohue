import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import './App.css';
import { Howl } from 'howler'; // Howler manages sound effects
import chroma from 'chroma-js'; // Color are all generated and mixed using chroma.js
import Confetti from 'react-confetti';
import axios from 'axios';
import Header from './components/header/Header';
import Byline from './components/footer/Byline';
import GameField from './components/GameField';
import AudioToggle from './components/footer/AudioToggle';
import ColorBubbleTray from './components/ColorBubbleTray';
import GameOverScreen from './components/GameOverScreen';
import Leaderboard from './components/Leaderboard';
import useWindowSize from 'react-use/lib/useWindowSize'
// import statechart from './statechart';

// Leave both server addresses here in case you want to switch
// let dataSource = 'https://twohue-leaderboard-server.herokuapp.com/players';
let dataSource = 'http://localhost:3001/players';

let maxLossCount = 6;
let maxAttemptCount = 6;
let value;
// let previsAudioOn;
// let solutionColors;


export default function App(props) {
  // gameStates: 
  // 'loading', 'homeScreenPractice', 'setUpColorRound',
  // 'roundN', 'attemptN', 'checkSolution',  
  // 'playerWinsRound', 'playerLoosesRound', 'showSolution', 
  // 'incrementRound', 'gameOver', 'gameOverTransition', 
  // 'joinLeaderboard','viewLeaderboard', 'leaderboardAPICall' 
  const [gameState, setGameState] = useState('loading');
  const [confettiRecycle, setConfettiRecycle] = useState(false);
  const [runRoundConfetti, setRunRoundConfetti] = useState(false);
  const [runGameOverConfetti, setrunGameOverConfetti] = useState(false);
  const [displayScoreBoard, setDisplayScoreBoard] = useState(false);
  const [displayStartButton, setDisplayStartButton] = useState(true);
  const [displayIntroMessage, setDisplayIntroMessage] = useState(true);
  const [displayIntroAnimation, setDisplayIntroAnimation] = useState(true);
  const [displayGameOverMessage, setDisplayGameOverMessage] = useState(false);
  const [displayPlayAgainButton, setDisplayPlayAgainButton] = useState(false);
  const [displayGameOverConfetti, setDisplayGameOverConfetti] = useState('none')
  const [round, setRound] = useState(0);
  const [attempt, setAttempt] = useState(0);
  const [lostRounds, setLostRounds] = useState(0);
  const [score, setScore] = useState(0);
  const [colorRound, setColorRound] = useState({});
  const [allColorBubbles, setAllColorBubbles] = useState([]);
  const [numWrongColorBubbles, setNumWrongColorBubbles] = useState(0);
  const [currentField, setCurrentField] = useState('leftField');
  const [leftFieldStyle, setLeftFieldStyle] = useState({ backgroundColor: '#ffffff' });
  const [rightFieldStyle, setRightFieldStyle] = useState({ backgroundColor: '#ffffff' });
  const [isAudioOn, setIsAudioOn] = useState(false);
  const [displayLeaderboard, setDisplayLeaderboard] = useState(false);
  const [newLeaderboardInductee, setNewLeaderboardInductee] = useState('');

  const [wrongColors, setWrongColors] = useState([]);
  const [currentFieldHover, setCurrentFieldHover] = useState('leftField');
  // is there a reason to this?
  const [playerWinRound, setPlayerWinRound] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [displaySolution, setDisplaySolution] = useState(false);
  const [leaderboardServerDown, setLeaderboardServerDown] = useState(false);
  const [previousScore, setPreviousScore] = useState(0);
  const [loadingSpinner, setLoadingSpinner] = useState(false);

  /*
  We can make a useEffect hook not run on initial render
  by creating a variable with the useRef hook to keep track
  of when the first render is done. Set the variable’s value
  to true initially. When the component is rendered the first time,
  set the variable to false.
  */
  const firstUpdate = useRef(true);

    if (gameState === 'homeScreenPractice') {
      maxAttemptCount = 30; 
    } else {
      maxAttemptCount = 6;
    }

  // ***********************************
  // Here's where the app begins.
  // Run this only on first render (as evidenced by empty array)
  // ***********************************
  useEffect(() => {
    initializeGame();
    // console.log('process.env.NODE_ENV:', process.env.NODE_ENV)
    axiosGetAllLeaderboardResults();
    
    // A couple things change depending on whether
    // we're in production vs. development
    if (process.env.NODE_ENV === 'production') {
      // console.log = function () {};
      setIsAudioOn(true);
    } else if (process.env.NODE_ENV === 'development') {
      maxLossCount = 2;
      maxAttemptCount = 4;
    }
  }, []);
  
  function initializeGame() {
    console.log('🪄 initializeGame() hello player');
    setDisplayPlayAgainButton(false);
    setGameState('homeScreenPractice');
    generateColorRound();
  }
  
  useEffect(() => {
    // keep this for development
    console.log('🚦🚦🚦 gameState is:', gameState)
  }, [gameState]);
  
  function startGameClickHandler() {
    setDisplayIntroAnimation(false);
    setDisplayStartButton(false);
    setDisplayPlayAgainButton(false);
    setDisplayIntroMessage(false);
    setDisplayScoreBoard(true);
    setDisplayGameOverConfetti('none');
    setDisplayGameOverMessage(false);
    calculateNumWrongColorBubbles()
    setLostRounds(0);
    setAttempt(0);
    setRound(0);
    setPreviousScore(0);
    setScore(0);
    console.log('🏁 start game click handler', round);
  }

  function setUpRoundN() {
    console.log("🚜 setUpRoundN. round:", round)
    beginRoundSound();
    setGameState('setUpColorRound')
    setRunRoundConfetti(false);
    setConfettiRecycle(false);
    setPlayerWinRound(false);
    incrementRound()
    setAttempt(0);
    setLeftFieldStyle({backgroundColor: '#ffffff'});
    setRightFieldStyle({backgroundColor: '#ffffff'});
  }

  function incrementRound() {
    setRound(round => round + 1);
    console.log("+ 1 increment round to: ", round)
  }

  // =================================================
  // When the round changes, generate a color round 
  // =================================================
  useLayoutEffect(() => {
    if (gameState === 'loading') {return}
    if (gameState === "homeScreenPractice") {return}
    if (gameState === "game-over") {return}
    generateColorRound();
    setGameState('roundN')
  }, [round])
  
  // =================================================
  // Every time the lostRound changes, determine if
  // player has run out of rounds to loose
  // =================================================
  useEffect( ()=> {
    if (lostRounds === maxLossCount) {
      // Transition to game over
      console.log("😣 player reaches max lost rounds. Game over.")
      gameOver();
    }
  }, [lostRounds])
  

   // =================================================
   // Check the solution after every attempt
   // =================================================
   useEffect( () => {
    // Don't run on first render (firstUpdate)
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
    if (gameState === 'homeScreenPractice') {
      console.log("🎬 practice round. keep making attempts")
      return
    }
    // Guard clause: return whe attempt resets to 0
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
        setGameState('playerWinsRound');
        playerWinsRound();
    
        // incorrect
      } else {
        playerMadeWrongGuess()
      }
  
  }, [attempt])

 
  function playerMadeWrongGuess() {
    console.log("👎 wrong guess")
    if (attempt < maxAttemptCount) {
      console.log("player makes an other guess")
    } else {
      console.log("😖 player out of guesses - show solution")
      showSolution()
      playerLoosesRound()
    }
  }

  //  ===================================
  //  Player Wins Round
  //  ===================================
  function playerWinsRound() {
    console.log("Player wins round 🎉 🎉 🎉 🎉 🎉")
    setGameState('playerWinsRound')
    playWinSound();
    setPlayerWinRound(true);
    increasePlayerScore();    
    // After x seconds, proceed to setUpRoundN()
    setTimeout(function () {
      setUpRoundN();
    }, 3000);
  };
  
  // useLayoutEffect( () => {
  //   console.log("player wins. Here's confetti")
  //   if (playerWinsRound) {
  //     setRunRoundConfetti(true);
  //   }
  // }, [playerWinsRound])

  //  ===================================
  //  Player Looses Round
  //  ===================================
  function playerLoosesRound(maxLossCount) {
    console.log('😭 player looses round');
    setGameState('playerLoosesRound')
    playLoseSound();
    showSolution()
    setLostRounds(lostRounds => lostRounds + 1)
  }
  
  function showSolution() {
    setGameState('showSolution');
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
    // Transition to next round or game over after X seconds
    setTimeout(function () {
      console.log("lostRounds:", lostRounds, "maxLossCount:", maxLossCount)
      if (lostRounds < maxLossCount) {
        console.log(`🌗 Set up next round`);
        setUpRoundN()
      } else if (lostRounds >= maxLossCount) {
        console.log(`🌑 Transition to gameOver()`);
        gameOver()
      }
    }, 2000);

  }, [lostRounds])
   

  function gameOver() {
    setGameState('game-over');
    gameOverChimes();
    setDisplayScoreBoard(false);
    setDisplayGameOverMessage(true);
    setDisplayPlayAgainButton(true);
    setrunGameOverConfetti(true);
    setDisplayGameOverConfetti('block');
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

      // What is smaller? 9 or the 'array length - 1'?
      // Either pick the last item in the array, or the 10th item,
      // whichever is smaller.
      // We do this in case the array has fewer than 10 members.
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

    // Transition to leaderboard after X seconds
    setTimeout(function () {
      evaluateIfLeaderboardMaterial();
    }, 3000);
  }

  function joinLeaderboard() {
    setGameState('joinLeaderboard');
    setDisplayLeaderboard(true)
    setNewLeaderboardInductee('');
  }

  function leaderboard() {}

  function leaderboardAPICall() {
    // POST a new leaderboard inductee, then GET the results again.
    // The leaderboard only shows the top 10 results,
    // so the new inductee will appear in the list
    axiosPostNewLeaderboardInductee( () => {
      // props.transition('FILLED_OUT_FORM')
    axiosGetAllLeaderboardResults()
    });
  }

  /*
  The game gets harder by increasing the number of 
  "wrong color bubbles" to choose from. Round 1 has 1 
  wrong bubble (therefore 3 bubbles total), Round 2 has  
  2 wrong bubbles (therefore 4 bubbles total) and so on.
  The max number of wrong bubbles is 6.
  */
  function calculateNumWrongColorBubbles() {
    if (gameState === 'homeScreenPractice') {
      setNumWrongColorBubbles(0);
    } else {
      setNumWrongColorBubbles(round);
   }}

  function generateColorRound() {
    setGameState('generateColorRound')
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
          numWrongColorBubbles tells us how many times we
          generate a random 'wrong color' to push into
          getter methods are used to access the properties of an object
          */
         get wrongColors() {
           // first, empty the array of old colors
           wrongColorsArray = [];
           
        console.log("🎠 Hello from newColorRound. round:", round)

        for (let i = round; i > 0; i--) {
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
    if (gameState === 'playerWinsRound') return;
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
    if (gameState === 'playerWinsRound') return;

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
    if (gameState === "game-over") {
      console.log("✋ game-over - click handler disabled")
      return
    };
    if (attempt >= maxAttemptCount) {
      console.log("✋ attempt >= maxAttemptCount - click handler disabled")
      return
    };
    if (playerWinsRound === true) {
      console.log("✋ playerWinsRound === true - click handler disabled")
      return
    };

    setAttempt(attempt + 1);
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

  function resetScoreForNextGame() {
    setScore(0);
    setLostRounds(0);
  }

  //  ==================================
  //  Leaderboard
  //  ==================================
  //  GET
  //  ==================================

  function axiosGetAllLeaderboardResults() {
    axios.get(dataSource)
      .then( (response) => {
        setLeaderboardData(response.data)
        console.log('leaderboardData: ', leaderboardData)
      })
      .catch(function (error) {
        // If there's an error
        console.log('axiosGetAllLeaderboardResults() error:', error);
        setLeaderboardServerDown(true)

        if (leaderboardServerDown === true) {
         console.log("leaderboard down but here's the play again button")
          setDisplayPlayAgainButton(true);
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
        player: newLeaderboardInductee || 'enigma',
        score: score,
      })
      .then(function (response) {
        console.log('leaderboard axios call response: ', response.data);
      })
      .then(() => {
        axiosGetAllLeaderboardResults();
      })
      .then(() => {
        console.log('after axiosGetAllLeaderboardResults()');
        props.transition('API_DATABASE_CALL_COMPLETE');
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  function handleChange(event) {
    console.log('leaderboard form value:',  event.target.value)
    // function setNewLeaderboardInductee (event.target.value) =>  {
      // console.log('newLeaderboardInductee: ', newLeaderboardInductee)
    // }
  }

  function handleSubmit(event) {
    event.preventDefault();
    props.transition('FILLED_OUT_FORM');
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
        />
      </div>
      <div
        className='win-game-confetti'
        style={{display: displayGameOverConfetti}} 
      >
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
        <Header
          transition={props.transition}
          round={round}
          maxLossCount={maxLossCount}
          maxAttemptCount={maxAttemptCount}
          lostRounds={lostRounds}
          attempt={attempt}
          score={score}
          previousScore={previousScore}
          setPreviousScore={setPreviousScore}
          resetScoreForNextGame={resetScoreForNextGame}
          beginRoundSound={beginRoundSound}
          isAudioOn={isAudioOn}
          startGameClickHandler={startGameClickHandler}
          displayScoreBoard={displayScoreBoard}
          displayStartButton={displayStartButton}
          displayPlayAgainButton={displayPlayAgainButton}
          displayIntroMessage={displayIntroMessage}
          setUpRoundN={setUpRoundN}
        />

          <GameOverScreen
            score={score}
            leaderboardData={leaderboardData}
            displayGameOverMessage={displayGameOverMessage}
          />

          <Leaderboard
            leaderboardData={leaderboardData}
            score={score}
            value={value}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            newLeaderboardInductee={newLeaderboardInductee}
            resetScoreForNextGame={resetScoreForNextGame}
            loadingSpinner={loadingSpinner}
            displayLeaderboard={displayLeaderboard}
          />

        <div id='game-field'>

            <GameField
              colorRound={colorRound}
              currentField={currentField}
              leftFieldStyle={leftFieldStyle}
              rightFieldStyle={rightFieldStyle}
              displaySolution={displaySolution}
            />

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