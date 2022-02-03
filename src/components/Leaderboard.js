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

    return (
      <div>
      {(props.gameState === 'joinLeaderboard' ||
       props.gameState === 'gameOver') &&

        <div id="leaderboard-component">
        
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
                    {item.player}
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
              gameState={props.gameState}
            />

            <ReactSpinners loadingSpinner={props.loadingSpinner} />
        </div>
      </div>
      }
    </div>
    );
}

