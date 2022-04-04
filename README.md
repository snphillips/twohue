## About TwoHue

Twohue is a one-player color mixing game. Players are presented with a color sample that they must recreate using two transparent color swatches from a set of several swatches.

The front end twohue is created with React.
The back end leaderboard server is created with Node/Express. See the repo for the server here: https://github.com/snphillips/twohue-leaderboard-server

I use the color library **chroma.js** to dynamically create unlimmited game rounds,

View deployed game here: http://twohue.surge.sh

<img src="https://i.imgur.com/iaWzlC8.png" width="350">
<img src="https://i.imgur.com/zIltcWs.png" width="350">


## How to Play
The player is presented with a brief introduction to the game and a "start" button.

The player is shown: 

- a circle containing the target color,
- a set of smaller color swatches, two of which are the solution,
- outlines of two overlapping large circles(like a Venn diagram).

The player selects the two colors they believe mix to create the target color. Points are assigned based on how few attempts the player solves the round in. Fewer tries = more points. The goal of the game is to win as many points as the player can before loosing six rounds.


## Getting Started
note: the backend server for the leaderboard can be found here: https://github.com/snphillips/twohue-leaderboard-server

clone this repo:

`git clone https://github.com/snphillips/twohue.git`

get into the correct directory:

`cd twohue`

run npm to install all the dependencies:

`npm install`

start the server:

`npm start`

your browser should open to http://localhost:3000/ !


## Made With
- Create React App
- Chroma.js https://www.npmjs.com/package/chroma-js
- react-confetti (for cool falling confetti effect) https://www.npmjs.com/package/react-confetti
- Howler.js (for sound effects) https://www.npmjs.com/package/howler
