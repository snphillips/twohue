import React, { useState, useEffect, useRef } from 'react';
import { Howl } from 'howler'; // Howler manages sound effects
import chroma from 'chroma-js'; // Color are all generated and mixed using chroma.js
import Confetti from 'react-confetti';
import LeftSidebar from './components/leftsidebar/LeftSidebar';
import Byline from './components/footer/Byline';
import GameField from './components/gameboard/GameField';
import AudioToggle from './components/footer/AudioToggle';
import ColorBubbleTray from './components/gameboard/ColorBubbleTray';
import MessageBoard from './components/gameboard/MessageBoard';
import Leaderboard from './components/gameboard/Leaderboard';
import useWindowSize from 'react-use/lib/useWindowSize';
import RightSidebar from './components/rightsidebar/RightSidebar';

// Leave both server addresses here in case you want to switch
// let dataSource = 'https://twohue-leaderboard-server.herokuapp.com/players';
let dataSource = 'twohue-serverless-leaderboard.netlify.app/players';
// let dataSource = 'http://localhost:3001/players';

let maxLossCount = 6;
let maxAttemptCount = 6;

export default function App(props) {
  const [confettiRecycle, setConfettiRecycle] = useState(false);
  const [runRoundConfetti, setRunRoundConfetti] = useState(false);
  const [runGameOverConfetti, setRunGameOverConfetti] = useState(false);
  const [displayLeaderboardForm, setDisplayLeaderboardForm] = useState(true);
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
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [leaderboardServerDown, setLeaderboardServerDown] = useState(false);
  const [previousScore, setPreviousScore] = useState(0);
  // have to insert this during leaderboard api calls
  const [loadingSpinner, setLoadingSpinner] = useState(false);
  const [gameState, setGameState] = useState('homeScreenPractice');

  // ***********************************
  // App begins here
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
  fetchLeaderboardResults();
  homeScreenPractice();
}, []);

  function homeScreenPractice() {
    // Hard coded practice colors
    setColorRound({
      solutionColor1: '#8cb5ef',
      solutionColor2: '#d79fb3',
      targetColor: '#7671a8',
      solutionColors: ['#8cb5ef', '#d79fb3'],
      wrongColorsArray: [],
    });
    setAllColorBubbles(['#8cb5ef', '#d79fb3']);
  }

  // And in the sound useEffect:
  useEffect(() => {
    const soundFileObj = {
      setUpRoundN: 'finger-snap.wav',
      playerWins: 'success.wav',
      showSolution: 'wrong-guess.wav',
      gameOver: 'windchimes.mp3',
    };
    if (soundFileObj[gameState]) playSound(soundFileObj[gameState]);
  }, [gameState, isAudioOn]);

  function startGameClickHandler() {
    setConfettiRecycle(false);
    setLostRounds(0);
    setRound(0);
    setPreviousScore(0);
    setScore(0);
    setUpRoundN();
  }

  function setUpRoundN() {
  setGameState('setUpRoundN');
  setRound((r) => r + 1);
  setRunRoundConfetti(false);
  setAttempt(0);
  setLeftFieldStyle({ backgroundColor: '#ffffff' });
  setRightFieldStyle({ backgroundColor: '#ffffff' });
}

  // =================================================
  // When the round changes, generate a color round
  // =================================================
useEffect(() => {
  // Practice round uses hard-coded colors, so skip generation
  if (gameState === 'homeScreenPractice') return;
  setGameState('generateColorRound');

  let soluColor1, soluColor2, targColor;
  let colorLightness = 29;

  /*
  If the target color is too dark (like blackish),
  the round is nearly impossible to play.
  Keep looping until we find solution colors whose
  blended result isn't too dark. Chroma's .get('lab.l')
  measures lightness on the LAB color scale.
  */
  while (colorLightness <= 30) {
    soluColor1 = chroma.random().hex();
    soluColor2 = chroma.random().hex();
    targColor = chroma.blend(soluColor1, soluColor2, 'multiply');
    colorLightness = chroma(targColor).get('lab.l');
  }

  // Add more wrong colors as rounds progress, capped at 6
  const numWrongColors = Math.min(round, 6);
  const wrongColors = Array.from({ length: numWrongColors }, () => chroma.random().hex());

  // The two correct answer colors
  const solutionColors = [chroma(soluColor1).hex(), chroma(soluColor2).hex()];

  // Merge solution and wrong colors into one array for the bubble tray
  const allBubbles = [...solutionColors, ...wrongColors];

  // Fisher-Yates shuffle so the solution bubbles
  // aren't always the first two in the tray
  for (let i = allBubbles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * i);
    [allBubbles[i], allBubbles[j]] = [allBubbles[j], allBubbles[i]];
  }

  setColorRound({
    solutionColor1: soluColor1,
    solutionColor2: soluColor2,
    targetColor: targColor,
    solutionColors,
  });
  setAllColorBubbles(allBubbles);

  // Round is ready to play
  setGameState('roundN');
}, [round]);

useEffect(() => {
  if (gameState === 'homeScreenPractice') return;
  if (attempt === 0) return;

  const leftFieldHexColor = chroma(leftFieldStyle.backgroundColor).hex();
  const rightFieldHexColor = chroma(rightFieldStyle.backgroundColor).hex();
  const solutionColors = colorRound.solutionColors;

  if (
    solutionColors.includes(leftFieldHexColor) &&
    solutionColors.includes(rightFieldHexColor) &&
    leftFieldHexColor !== rightFieldHexColor
  ) {
    playerWins();
  } else {
    playerMadeWrongGuess();
  }
}, [attempt, colorRound, leftFieldStyle, rightFieldStyle]);



  function playerMadeWrongGuess() {
    if (attempt >= maxAttemptCount) {
      playerLoosesShowSolution();
    }
  }

  //  ===================================
  //  Player Wins Round
  //  ===================================
  function playerWins() {
    setGameState('playerWins');
    setRunRoundConfetti(true);
    increasePlayerScore();
    // Wait a moment before setting up the next round
    setTimeout(function () {
      setUpRoundN();
    }, 2000);
  }

  //  ===================================
  //  Player Looses Round
  //  ===================================
function playerLoosesShowSolution() {
  setGameState('playerLoosesShowSolution');
  showSolution();
  setLostRounds((lostRounds) => lostRounds + 1);
}

  function showSolution() {
    setGameState('showSolution');

    setLeftFieldStyle({
      backgroundColor: colorRound.solutionColor1,
      animation: 'fadein 1.25s',
    });
    setRightFieldStyle({
      backgroundColor: colorRound.solutionColor2,
      animation: 'fadein 1.25s',
    });
  }

  function gameOver() {
  setGameState('gameOver');
  setRunGameOverConfetti(true);
  setConfettiRecycle(true);

  if (leaderboardServerDown) {
    console.log('🚨 leaderboard is not available');
  }

  const lowestScoreIndex = Math.min(9, leaderboardData.length - 1);
  const lowestCurrentScore = leaderboardData[lowestScoreIndex].score;

  if (score >= lowestCurrentScore) {
    joinLeaderboard();
  }
}

  useEffect(() => {
    if (gameState === 'homeScreenPractice') return;
    if (lostRounds === 0) return;

    setTimeout(() => {
      if (lostRounds < maxLossCount) {
        setUpRoundN();
      } else {
        gameOver();
      }
    }, 2000);
  }, [lostRounds]);


  function joinLeaderboard() {
    setGameState('joinLeaderboard');
    setNewLeaderboardInductee('');
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
    if (
      gameState === 'gameOver' ||
      gameState === 'playerWins' ||
      gameState === 'setUpRoundN' ||
      attempt >= maxAttemptCount
    ) {
      return;
    }
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
    if (currentField === 'leftField') {
      setLeftFieldStyle((prev) => ({ ...prev, border: '8px solid #abb2b9' }));
    } else {
      setRightFieldStyle((prev) => ({ ...prev, border: '8px solid #abb2b9' }));
    }
  }

  function currentFieldMouseLeave() {
    if (gameState === 'playerWins') return;
    if (currentField === 'leftField') {
      setLeftFieldStyle((prev) => ({ ...prev, border: '3px solid #abb2b9' }));
    } else {
      setRightFieldStyle((prev) => ({ ...prev, border: '3px solid #abb2b9' }));
    }
  }

  /* ====================================
   Toggling between the left and right fields,
   to determine which one will get filled in with color.
   ==================================== */
  function toggleLeftRightField() {
    setCurrentField((prev) => prev === 'leftField' ? 'rightField' : 'leftField');
  }

  function increasePlayerScore() {
    const pointsByAttempt = { 2: 6, 3: 4, 4: 3, 5: 2, 6: 1 };
    const points = pointsByAttempt[attempt];
    if (!points) return;
    setPreviousScore(score);
    setScore((score) => score + points);
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

  /* 
  ==================================
  🎶 audio button switch toggle
  if audio is on the state of isAudioOn is true,
  if audio is off the state of isAudioOn is false,
  the ! is the opposite of what it currently is.
  So, set the state to the 'opposite' of what it is.
  ==================================
  */
  function soundButtonToggle() {
    setIsAudioOn(!isAudioOn);
  }

  // function bubbleSound() {
  //   /*
  //   Using the Howler npm package for sound
  //   There are two distinct bubble sounds: 
  //   One for the left, one for the right.
  //   */

  //   if (isAudioOn === false) return;

  //   if (currentField === 'leftField') {
  //     const sound = new Howl({
  //       src: ['/sound/moogy73_perc14.wav'],
  //     });
  //     sound.play();
  //   } else if (currentField === 'rightField') {
  //     const sound = new Howl({
  //       src: ['/sound/moogy73_perc15.wav'],
  //     });
  //     sound.play();
  //   }
  // }

  function playSound(filename) {
    if (!isAudioOn) return;
    new Howl({ src: [`/sound/${filename}`] }).play();
  }

  function bubbleSound() {
    /*
    Using the Howler npm package for sound
    There are two distinct bubble sounds: 
    One for the left, one for the right.
    */

    const file = currentField === 'leftField' ? 'moogy73_perc14.wav' : 'moogy73_perc15.wav';
      playSound(file);
  }

  //  ==================================
  //  Leaderboard
  //  ==================================
  //  GET
  //  ==================================

async function fetchLeaderboardResults() {
  try {
    const response = await fetch(dataSource);
    if (!response.ok) throw new Error(`Server error: ${response.status}`);
    const data = await response.json();
    setLeaderboardData(data);
  } catch (error) {
    console.log('🥺 leaderboard unavailable:', error);
    setLeaderboardServerDown(true);
  }
}

  //  =================================
  //  POST
  //  =================================
async function postNewLeaderboardInductee() {
  // TODO: what's your plan for trimmedName?
  //   // we need to update leaderboard with trimmedName b/c
  //   // database can't accept strings longer than 12 chars.
  const trimmedName = newLeaderboardInductee.substring(0, 12) || 'Bob Sacamano';

  try {
    const response = await fetch(dataSource, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ player: trimmedName, score }),
    });
    if (!response.ok) throw new Error(`Server error: ${response.status}`);
    await fetchLeaderboardResults();
  } catch (error) {
    console.log('Post error:', error);
  }
}

  function handleChange(event) {
    // console.log('leaderboard form value:', event.target.value);
    setNewLeaderboardInductee(event.target.value);
    // console.log('newLeaderboardInductee: ', newLeaderboardInductee);
  }

  function handleSubmit(event) {
  event.preventDefault();
  postNewLeaderboardInductee();
  setDisplayLeaderboardForm(false);
}

  // *****************************************************
  // *****************************************************
  // *****************************************************
  // *****************************************************

  // Confetti falls across whole window
  // even if window is resized
  const { width, height } = useWindowSize();

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
          onConfettiComplete={(confetti) => {
            confetti.reset();
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
              gameOver={gameOver}
            />
          </aside>
          <main>
            <MessageBoard gameState={gameState} score={score} />

            <Leaderboard
              gameState={gameState}
              leaderboardData={leaderboardData}
              score={score}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              newLeaderboardInductee={newLeaderboardInductee}
              loadingSpinner={loadingSpinner}
              leaderboardServerDown={leaderboardServerDown}
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
            />
          </aside>
        </div>

        {gameState !== 'joinLeaderboard' &&
          gameState !== 'leaderboard' &&
          gameState !== 'gameOver' && (
            <div className='gamefield-bottom' style={{ display: 'block' }}>
              <ColorBubbleTray
                gameState={gameState}
                allColorBubbles={allColorBubbles}
                currentField={currentField}
                currentFieldMouseEnter={currentFieldMouseEnter}
                currentFieldMouseLeave={currentFieldMouseLeave}
                bubbleClickHandler={bubbleClickHandler}
              />
            </div>
          )}
        <div style={{ display: 'flex', flexGrow: '1' }}></div>
        <footer>
          <Byline />
          <AudioToggle soundButtonToggle={soundButtonToggle} isAudioOn={isAudioOn} />
        </footer>
      </div>
    </div>
  );
}
