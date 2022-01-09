import React from 'react';


export default function GameField(props) {
  return (
    <div>
      <div id="target-swatch"
          className=""
          style={
            {
              'backgroundColor': props.colorRound.targetColor
            }
          } >
          &nbsp;
        <span className="tooltiptext">target color</span>
      </div>

      <section id="left-and-right-field">

        <div className="field"
            id="left-field"
            style={props.leftField}
            >&nbsp;
        </div>

        <div className="field"
            id="right-field"
            style={props.rightField}
            >&nbsp;
        </div>
      </section>
    </div>
  );
}
