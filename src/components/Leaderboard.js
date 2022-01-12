import React from "react";
import LeaderboardForm from "./LeaderboardForm";
// the spinner in a dependency
import ReactSpinners from "./ReactSpinners";

/*
========================
Map over the array of leaderboard winners.
Return an unordered list <ul>.
Each list item <li> contains the players number in the list,
their nickname & their score.

The leaderboard form is only displayed if the player's score is
equal to, or more than the last person in the list.

If for some reason the leaderboard doesn't load due to
a server error, the leaderboard donesn't display.
========================
*/

export default function Leaderboard(props) {

  let displayLeaderboardStyle;
  props.displayLeaderboard ? displayLeaderboardStyle = 'block' : displayLeaderboardStyle = 'none'

  let displayPlayAgainButtonStyle;
  props.displayPlayAgainButton ? displayPlayAgainButtonStyle = 'block' : displayPlayAgainButtonStyle = 'none'

    return (
      <div>
        <div 
          id="leaderboard-component"
          style={{display: displayLeaderboardStyle}}
        >
          <div className="leaderboard-title">high scores</div>

          <ul className="leaderboard-list">
            {props.leaderboardData.map((item) => {
              let playerIndex = props.leaderboardData.indexOf(item);

              return (
                <li
                  key={playerIndex}
                  className="leaderboard-entry"
                  id={"leaderboard-entry" + playerIndex}
                >
                  <span className="player-rank">
                    {playerIndex + 1}&nbsp;{item.player}
                  </span>
                  <span className="player-score">{item.score}</span>
                </li>
              );
            })}
          </ul>

        <div className="lederboard-form-placeholder">
            <LeaderboardForm
              handleChange={props.handleChange}
              handleSubmit={props.handleSubmit}
              newLeaderboardInductee={props.newLeaderboardInductee}
            />

            <ReactSpinners loadingSpinner={props.loadingSpinner} />
        </div>
      </div>

          <button
            className="play-again-button"
            style={{display: displayPlayAgainButtonStyle }}
            onClick={() => {
              props.resetScoreForNextGame();
              props.startGameClickHandler();
              // props.transition("START_GAME");
            }}
          >
            play again
          </button>
      </div>
    );
}

