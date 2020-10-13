## About TwoHue with State Machine

TwoHue with State Machine is a a refactor of the game TwoHue I created a couple years ago.

In this version I've made several changes, including:

1) I use **react-automata** to create an X-state machine that manages user flow,
2) I use the color library **chroma.js** to dynamically create unlimmited game rounds,
3) I change the game logic so that the game ends when the player looses x rounds, and 
4) I added a node/express server to host a leaderboard of top players

View deployed game here: http://twohue-state-machine.surge.sh

<img src="https://i.imgur.com/iaWzlC8.png" width="350">
<img src="https://i.imgur.com/i91exEK.png" width="350">
<img src="https://i.imgur.com/hD0Y5QT.png" width="250">

## How to Play
The player is presented with a brief introduction to the game and a "begin game" button.

The player is shown a circle containing the target color along with a set of six smaller color swatches along the bottom of the game-field, and outlines of two overlapping large circles(like a Venn diagram), in the center of the screen (the gameboard).

The player will select the first color swatch that they believe is one of the colors that contribute to the target color. Once they click on a swatch, the large circle outline on the left fills with their selection. The player then selects the second color they believe contributes to the target color. That color fills the large circle outline on the right. The overlapping almond shape that is created between the two large circles displays a color, which will match the target color if the player picked correctly.

The goal of the game is to win as many rounds of the game as the player can.

**Winning the Round** If the color they created matches the target, they are given feedback that they have successfully completed that round and are rewarded with a point and confetti.

**Loosing the Round** If the color they created is not a match, the user is prompted to try again. If the user is not successful after six tries, the solution is revealed, and a new round begins.

## Getting Started
clone this repo:

`git clone https://github.com/snphillips/twohue-state-chart.git`

get into the correct directory:

`cd twohue-state-machine`

run npm to install all the dependencies:

`npm install`

start the server:

`npm start`

your browser should open to http://localhost:3000/ !

Visualize your state chart by pasting into this tool: https://xstate.js.org/viz/




## Made With
- Create React App
- React Automata (an X-state library for React) https://www.npmjs.com/package/react-automata
- Chroma.js https://www.npmjs.com/package/chroma-js
- react-confetti (for cool falling confetti effect) https://www.npmjs.com/package/react-confetti
- Howler.js (for sound effects) https://www.npmjs.com/package/howler
