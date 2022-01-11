import React from "react";
import Title from "./Title";
import MessageBoard from "./MessageBoard";
import ScoreBoard from "./ScoreBoard";

export default function Header(props) {
  return (
    <header>
      <Title round={props.round} />

      <MessageBoard
        transition={props.transition}
        displayIntroMessage={props.displayIntroMessage}
        resetScoreForNextGame={props.resetScoreForNextGame}
      />

      <ScoreBoard
        round={props.round}
        attempt={props.attempt}
        score={props.score}
        previousScore={props.previousScore}
        looseRound={props.looseRound}
        maxLossCount={props.maxLossCount}
        maxAttemptCount={props.maxAttemptCount}
        transition={props.transition}
        isAudioOn={props.isAudioOn}
        beginGameSound={props.beginGameSound}
        startGameClickHandler={props.startGameClickHandler}
        gameState={props.gameState}
        displayScoreBoard={props.displayScoreBoard}
        displayStartButton={props.displayStartButton}
      />
    </header>
  );
}
