import React from "react";
import LeaderboardForm from "./LeaderboardForm";
import { State } from "react-automata";
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
    return (
      <div id="leaderboard-component">
        <State is={["leaderboard", "joinLeaderboard", "leaderboardAPICall"]}>
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
        </State>

        <div className="lederboard-form-placeholder">
          <State is={["joinLeaderboard", "leaderboardAPICall"]}>
            <LeaderboardForm
              handleChange={props.handleChange}
              handleSubmit={props.handleSubmit}
              newLeaderboardInductee={props.newLeaderboardInductee}
            />
          </State>

          <State is={["leaderboardAPICall"]}>
            <ReactSpinners loading={props.loading} />
          </State>
        </div>

        <State
          is={[
            "leaderboard",
            "joinLeaderboard",
            "noLeaderboardPlayAgain",
            "leaderboardAPICall",
          ]}
        >
          <button
            className="play-again-button"
            onClick={() => {
              props.resetScoreForNextGame();
              // setState({ confettiFalling: false });
              // setState({ playerWinRound: false });
              props.transition("START_GAME");
            }}
          >
            play again
          </button>
        </State>
      </div>
    );
}
