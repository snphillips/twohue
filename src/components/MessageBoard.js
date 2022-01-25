import React from "react";

/*
==================================
Using react-automata's "State"
(yes- we have React-state & State-maching-state...
it gets confusing) UI elements will only display when
the game is in certain states. Note: you can have
multiple states in the State arrays

This component only displays when state is 
homeScreenPractice or showSolution
==================================
*/

export default function MessageBoard(props) {

  return (

    <section 
      className="message-board" 
      style={{height: '2.5rem'}}
      >

      {props.displayIntroMessage &&
      <div className="into-message">
        <p>Twohue is a color mixing game.</p>
        <p>Practice clicking bubbles before playing.</p>
      </div>
      }

      {props.displaySolution &&
      <p className="solution-label">
        Solution
      </p>
      }

    </section>
  );
}
