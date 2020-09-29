import React, { Component } from "react";
import LeaderboardForm from "./LeaderboardForm";
import { State } from "react-automata";

// ========================
// Map over the array of leaderboard winners.
// Return an unordered list <ul>.
// Each list item <li> contains the players number in the list,
// their nickname & their score.

// The leaderboard form is only displayed if the player's score is
// equal to, or more than the last person in the list.
// ========================


export default class Leaderboard extends Component {
  render() {

    return (

        <div id="leaderboard-component">
          <div className="leaderboard-title">high scores</div>

          <ul className="leaderboard-list">
            {this.props.leaderboardData.map((item) => {
              let playerIndex = this.props.leaderboardData.indexOf(item);

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
            <State is={["joinLeaderboard"]}>
              <LeaderboardForm
                handleChange={this.props.handleChange}
                handleSubmit={this.props.handleSubmit}
                newLeaderboardInductee={this.props.newLeaderboardInductee}
              />
            </State>
          </div>

      <button
          className="play-again-button"
          onClick={ () => {
            this.props.resetScoreForNextGame();
            this.setState({confettiFalling: false});
            this.setState({playerWinRound: false});
            this.props.transition('START_GAME');
        }}>
          play again
     </button>

        </div>
    );
  }
}
