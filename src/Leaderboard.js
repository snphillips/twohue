import React, { Component } from 'react';
import LeaderboardForm from './LeaderboardForm';
import { State } from 'react-automata';

export default class Leaderboard extends Component {
  render() {
    return (


    <div className="leaderboard-component">

      <div className="leaderboard-title">high scores</div>

        <ul className="leaderboard-list">
          {
           this.props.leaderboardData.map( item => {

             let playerIndex = this.props.leaderboardData.indexOf(item)

             return(
                <li
                  key={playerIndex}
                  className="leaderboard-entry"
                  id={"leaderboard-entry" + playerIndex}
                  >
                    <span className="player-rank">{playerIndex + 1}&nbsp;{item.player}</span>
                    <span className="player-score">{item.score}</span>
                </li>
             )
           })
         }
       </ul>

       <State is={['joinLeaderboard']}>
         <LeaderboardForm
           handleChange={this.props.handleChange}
           handleSubmit={this.props.handleSubmit}
           newLeaderboardInductee={this.props.newLeaderboardInductee}
         />
       </State>

    </div>

    );
  }
}



