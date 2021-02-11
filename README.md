## About TwoHue with State Machine

TwoHue with State Machine is a a refactor of the game TwoHue I created in 2018.

In this version I've made several changes, including:

1) I use **react-automata** (an Xstate library) to create a state machine that manages user flow,
2) I use the color library **chroma.js** to dynamically create unlimmited game rounds,
3) I change the game logic so that the game ends when the player looses x rounds, and 
4) I added a node/express server to host a leaderboard of top players.

View deployed game here: http://twohue-state-machine.surge.sh

<img src="https://i.imgur.com/iaWzlC8.png" width="350">


## How to Play
The player is presented with a brief introduction to the game and a "begin game" button.

The player is shown: 

- a circle containing the target color,
- a set of smaller color swatches, two of which are the solution,
- outlines of two overlapping large circles(like a Venn diagram).

The player selects the two colors they believe mix to create the target color. Points are assigned based on how few attempts the player solves the round in. Fewer tries = more points. The goal of the game is to win as many points as the player can before loosing six rounds.



## Getting Started
note: the backend server for the leaderboard can be found here: https://github.com/snphillips/twohue-state-machine-leaderboard-server

clone this repo:

`git clone https://github.com/snphillips/twohue-state-chart.git`

get into the correct directory:

`cd twohue-state-machine`

run npm to install all the dependencies:

`npm install`

start the server:

`npm start`

your browser should open to http://localhost:3000/ !

Visualize your state chart by pasting it into this tool: https://xstate.js.org/viz/




## Made With
- Create React App
- React Automata (an X-state library for React) https://www.npmjs.com/package/react-automata
- Chroma.js https://www.npmjs.com/package/chroma-js
- react-confetti (for cool falling confetti effect) https://www.npmjs.com/package/react-confetti
- Howler.js (for sound effects) https://www.npmjs.com/package/howler
