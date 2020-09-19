import React, { Component } from 'react';

export default class Leaderboard extends Component {
  render() {
    return (


    <div className="leaderboard-component">
      <div>leaderboard</div>

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
                  <span className="player-name">{item.player}&nbsp;</span>
                  <span className="player-score">{item.score}</span>
              </li>
           )
         })
       }

     </ul>

    </div>

    );
  }
}


