import { createMachine } from 'xstate';


  // // Action to increment the context amount
  // const incrementRoundz = assign({
  //   amount: (context, event) => context.roundz + 1
  // });

// ==============================
// https://xstate.js.org/viz/?gist=164f6bb8dff9841e0b57f244f214826c
// ==============================
const twohueMachine = createMachine({
  id: 'twohue',
  initial: 'initializeAppState',
  states: {
    initializeAppState: {
    entry: 'initializeApp',
    on: {
      TO_HOMESCREEN_PRACTICE_STATE: 'homeScreenPracticeState'
    },
  },
  homeScreenPracticeState: {
    entry: 'homeScreenPractice',
    on: {
      TO_INCREMENT_ROUND_STATE: 'incrementRoundState'
    },
  },
  incrementRoundState: {
    entry: 'incrementRound',
    on: {
      TO_GENERATE_COLOR_ROUND_STATE: 'generateColorRoundState'
    },
  },
  generateColorRoundState: {
    entry: 'generateColorRound',
    on: {
      TO_PREPARE_ROUNDN_STATE: 'prepareRoundNState'
    },
  },
  prepareRoundNState: {
    entry: 'prepareRoundN',
    on: {
      TO_ATTEMPTN_STATE: 'attemptNState',
    },
  },
  attemptNState: {
    entry: 'attemptN',
    on: {
      TO_EVALUATE_ATTEMPTN_STATE: 'evaluateAttemptState'
    },
  },
  evaluateAttemptState: {
    entry: 'evaluateAttempt',
    on: {
      FIRST_GUESS_TO_ATTEMPTN_STATE: 'attemptNState',
      TO_PLAYER_WINS_CONFETTI_FALLS_STATE: 'playerWinsConfettiFallsState',
      TO_WRONG_GUESS_STATE: 'wrongGuessState'
    },
  },
  playerWinsConfettiFallsState: {
    entry: 'playerWinsConfettiFalls',
    // after: {
    //   3000: {target: 'incrementRoundState'}
    // } 
    on: {
      TO_INCREMENT_ROUND_STATE: 'incrementRoundState',
    },
  },
  wrongGuessState: {
    entry: 'wrongGuess',
    on: {
      WRONG_GUESS_TO_ATTEMPT_STATE: 'attemptNState',
      WRONG_GUESS_TO_PLAYER_LOOSES_ROUND_STATE: 'playerLoosesShowSolutionState'
    },
  },
  playerLoosesShowSolutionState: {
    entry: 'playerLoosesShowSolution',
    on: {
      TO_INCREMENT_ROUND_STATE: 'incrementRoundState',
      TO_GAMEOVER_STATE: 'gameOverState'
    },
  },
  gameOverState: {
    entry: 'gameOver',
    on: {
      TO_LEADERBOARD_STATE: 'leaderboardState',
      TO_SERVER_ERROR_NO_LEADERBOARD_STATE: 'noLeaderboardState',
    },
  },
  leaderboardState: {
    entry: 'leaderboard',
    on: {
      TO_START_GAME_STATE: 'generateColorRoundState',
    }
  },
  noLeaderboardState: {
    entry: 'noLeaderboard',
    on: {
      TO_START_GAME_STATE: 'generateColorRoundState',
    }
  }
},
},
);

export default twohueMachine;
