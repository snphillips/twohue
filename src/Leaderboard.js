import React, { Component } from 'react';

export default class Leaderboard extends Component {
  render() {
    return (


    <div className="leaderboard">
      <h3>leaderboard</h3>

        <section className="leaderboard-list">

        {
         this.props.leaderboardData.map( item => {

           let playerIndex = this.props.leaderboardData.indexOf(item)

           return(
              <div
                key={playerIndex}
                className="leaderboard-entry"
                id={"leaderboard-entry" + playerIndex}
                >
                  <span>{item.player} {item.score}</span>
              </div>
           )
         })
       }

     </section>

    </div>

    );
  }
}


