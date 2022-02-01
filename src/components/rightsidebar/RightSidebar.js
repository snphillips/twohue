import React from 'react';
import StartButtons from './StartButtons';
import Scoreboard from './Scoreboard';

export default function RightSidebar(props) {
  return (
    
    <div style={{justifyContent: "flex-end"}}>

        <StartButtons
          startGameClickHandler={props.startGameClickHandler}
          displayPlayAgainButton={props.displayPlayAgainButton}
          setUpRoundN={props.setUpRoundN}
          gameState={props.gameState}
        />

        <Scoreboard 
          score={props.score}
          round={props.round}
          lostRounds={props.lostRounds}
          attempt={props.attempt}
          maxLossCount={props.maxLossCount}
          maxAttemptCount={props.maxAttemptCount}
          previousScore={props.previousScore}
          setPreviousScore={props.setPreviousScore}
          displayScoreBoard={props.displayScoreBoard}
        />


    </div>
  
  );
}
