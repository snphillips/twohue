import React from 'react';


export default function GameField(props) {

  
  return (
    <section>

      {(props.gameState !== 'joinLeaderboard' &&
        props.gameState !== 'leaderboard' &&
        props.gameState !== 'gameOver') &&
        <div>
          <div 
            id="target-swatch"
            style={{'backgroundColor': props.colorRound.targetColor}}>
              &nbsp;
            <span className="tooltiptext">target color</span>
          </div>

          <section id="left-and-right-field">

            <div 
              className="field"
              id="left-field"
              style={props.leftFieldStyle}
              >
                &nbsp;
            </div>

            <div className="field"
                id="right-field"
                style={props.rightFieldStyle}
                >&nbsp;
            </div>
          </section>
        </div>
      } 
    </section>
  );
}
