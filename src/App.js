import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
// import './App.css';
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


export default function App(props) {

  // gameStates: 
  // 'homeScreenPractice'  'setUpRoundN', 
  // 'generateColorRound', 'roundN', 'attemptN', 'checkSolution',  
  // 'playerWins', 'playerLoosesShowSolution', 'showSolution', 
  // 'incrementRound', 'gameOver', 'gameOverTransition', 
  // 'joinLeaderboard',
  const [gameState, setGameState] = useState('homeScreenPractice');
  const [confettiRecycle, setConfettiRecycle] = useState(false);
  const [runRoundConfetti, setRunRoundConfetti] = useState(false);
  const [runGameOverConfetti, setrunGameOverConfetti] = useState(false);
  const [displayLeaderboardForm, setDisplayLeaderboardForm] = useState(true);
  // const [displayGameField, setDisplayGameField] = useState(true);
  const [round, setRound] = useState(0);
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
  const [currentFieldHover, setCurrentFieldHover] = useState('leftField');
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [leaderboardServerDown, setLeaderboardServerDown] = useState(false);
  const [previousScore, setPreviousScore] = useState(0);
  // have to insert this during leaderboard api calls
  const [loadingSpinner, setLoadingSpinner] = useState(false);

  // ***********************************
  // Here's where the app begins.
  // Run this only on first render (as evidenced by empty array)
  // ***********************************
  useEffect(() => {
    // A couple things change depending on whether
    // we're in production vs. development
    if (process.env.NODE_ENV === 'production') {
      setIsAudioOn(true);
    } else if (process.env.NODE_ENV === 'development') {
      maxLossCount = 2;
      maxAttemptCount = 4;
    }
    setGameState('homeScreenPractice');
    axiosGetAllLeaderboardResults();
    initializeGame()
    homeScreenPractice()
  }, []);
  
  function initializeGame() {
      console.log('🪄 initializeGame() hello player');
   };

   function homeScreenPractice() {
     console.log("🍄 I'm in homeScreenPractice()", colorRound)
     // Hard code practice colors
     setColorRound({
       solutionColor1: '#8cb5ef',
       solutionColor2: '#d79fb3',
       targetColor: '#7671a8',
       solutionColors: ['#8cb5ef','#d79fb3'],
       wrongColorsArray: []
      })
      setAllColorBubbles(['#8cb5ef','#d79fb3'])
    }

  useEffect(() => {
    // keep this for development
    console.log('🚥 gameState is:', gameState)

    if (gameState === 'setUpRoundN') {
        setRound(round => round + 1);
        console.log("+ 1 increment round")
      }
  }, [gameState]);
  
  function startGameClickHandler() {
    setGameState('setUpRoundN')
    setRunRoundConfetti(false);
    setConfettiRecycle(false);
    setLostRounds(0);
    setAttempt(0);
    setRound(0);
    setPreviousScore(0);
    setScore(0);
    setUpRoundN();
    console.log('🏁 start game click handler', round);
  }

  function setUpRoundN() {
    console.log("🚜 setUpRoundN");
    setRunRoundConfetti(false);
    setGameState('setUpRoundN');
    beginRoundSound();
    setAttempt(0);
    setLeftFieldStyle({backgroundColor: '#ffffff'});
    setRightFieldStyle({backgroundColor: '#ffffff'});
    // TODO - find a place for this line. Not working here
    // what I don't get, is how the .disable-click persists?
    // document.querySelectorAll('.bubble').classList.remove('disable-click');
  }
  
  
  // =================================================
  // When the round changes, generate a color round 
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
        setGameState('playerWins');
        playerWins();
    
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
      playerLoosesShowSolution()
    }
  }

  //  ===================================
  //  Player Wins Round
  //  ===================================
  function playerWins() {
    console.log("🦄 Player wins round");
    setGameState('playerWins');
    setRunRoundConfetti(true);
    playWinSound();
    increasePlayerScore();    
    // After x seconds, proceed to setUpRoundN()
    setTimeout(function () {
      setUpRoundN();
    }, 3000);
  };

  useEffect( () => {
    console.log("🎊 runRoundConfetti updates", runRoundConfetti )
  }, [runRoundConfetti])

  //  ===================================
  //  Player Looses Round
  //  ===================================
  function playerLoosesShowSolution(maxLossCount) {
    console.log('😭 player looses round');
    setGameState('playerLoosesShowSolution');
    playLoseSound();
    showSolution();
    setLostRounds(lostRounds => lostRounds + 1);
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
    // Do not transition if gameState is "homescreenpractice"
    if (gameState === "homeScreenPractice") {return}
    // Do not transition if prevLostRounds is equal to lostRounds
    if (prevLostRounds.current === lostRounds) {return}
    // Player lost this round. 
    // Transition to either the next round or game over after X seconds
    setTimeout(function () {
      console.log("prevLostRounds", prevLostRounds.current, "lostRounds:", lostRounds, "maxLossCount:", maxLossCount)
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
    // setDisplayGameField(false);
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
    if (gameState !== 'homeScreenPractice') {
      console.log('gameState isnt practice, right?', gameState)
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
    if (gameState === 'playerWins') return;
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
    if (gameState === 'playerWins') return;

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

  function endGameClickHandler() {
    console.log("end game early")
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

  function beginRoundSound() {
    // Guard clause if player has toggled sound to be off
    if (isAudioOn === false) return;
    const sound = new Howl({
      src: ['/sound/finger-snap.wav'],
    });
    sound.play();
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
          style={{ display: 'block', width: '100%' }}
          gameState={gameState}
          endGameClickHandler={endGameClickHandler}
          gameOver={gameOver}
          // score={score}
          />
      </aside>
      <main>
        <MessageBoard
          gameState={gameState}
          score={score}
          />

          <Leaderboard
            gameState={gameState}
            leaderboardData={leaderboardData}
            score={score}
            value={value}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            newLeaderboardInductee={newLeaderboardInductee}
            loadingSpinner={loadingSpinner}
          />

        <div id='game-field'>
          <GameField
            gameState={gameState}
            colorRound={colorRound}
            currentField={currentField}
            leftFieldStyle={leftFieldStyle}
            rightFieldStyle={rightFieldStyle}
            />
        </div>

      </main>
      <aside className='right-side'>
        <RightSidebar
          gameState={gameState}
          round={round}
          score={score}
          attempt={attempt}
          startGameClickHandler={startGameClickHandler}
          maxLossCount={maxLossCount}
          maxAttemptCount={maxAttemptCount}
          lostRounds={lostRounds}
          previousScore={previousScore}
          setPreviousScore={setPreviousScore}
          beginRoundSound={beginRoundSound}
        />
      </aside>

    </div>

    {(gameState !== 'joinLeaderboard' &&
      gameState !== 'leaderboard' &&
      gameState !== 'gameOver') &&
    
    <div 
      className='gamefield-bottom'
      style={{
        display: 'block',
        // border: '1px solid gold'
      }}
      >
        <ColorBubbleTray
          gameState={gameState}
          allColorBubbles={allColorBubbles}
          currentField={currentField}
          currentFieldMouseEnter={currentFieldMouseEnter}
          currentFieldMouseLeave={currentFieldMouseLeave}
          bubbleClickHandler={bubbleClickHandler}
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