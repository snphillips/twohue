import React from 'react';

export default function Title(props) {

  let roundsDisplay;
  (props.displayScoreBoard ? roundsDisplay = 'block' : roundsDisplay = 'none')
  
  
  return (
    <section className="title-section">
      <h1>twohue</h1>
      <p style={{
          display: roundsDisplay
        }}
      >round: {props.round}</p>
    </section>

  );
}
