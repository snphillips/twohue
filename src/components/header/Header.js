import React from 'react';
import Title from './Title';
import MessageBoard from './MessageBoard';
import ScoreBoard from './ScoreBoard';
import StartButtons from './StartButtons';

export default function Header(props) {
  return (
    
    <header>
      <Title 
        style={{order: 1}}
        round={props.round}
        displayScoreBoard={props.displayScoreBoard}
      />

      <MessageBoard
        style={{order: 2}}
        transition={props.transition}
        displayIntroMessage={props.displayIntroMessage}
        resetScoreForNextGame={props.resetScoreForNextGame}
      />

      <div style={{order: 3}}>
        <ScoreBoard
          attempt={props.attempt}
          score={props.score}
          previousScore={props.previousScore}
          lostRounds={props.lostRounds}
          maxLossCount={props.maxLossCount}
          maxAttemptCount={props.maxAttemptCount}
          transition={props.transition}
          isAudioOn={props.isAudioOn}
          beginGameSound={props.beginGameSound}
          gameState={props.gameState}
          displayScoreBoard={props.displayScoreBoard}
          />

        <StartButtons
          displayStartButton={props.displayStartButton}
          displayPlayAgainButton={props.displayPlayAgainButton}
          startGameClickHandler={props.startGameClickHandler}
        />
      </div>
    </header>
  
  );
}
