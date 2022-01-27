import { createMachine } from 'xstate';





// ==============================
// https://xstate.js.org/viz/?gist=164f6bb8dff9841e0b57f244f214826c
// ==============================
const twohueMachine = createMachine({
  id: 'twohue',
  initial: 'initializeApp',
  states: {
  initializeApp: {
    entry: 'initializeApp',
    on: {
      ONTO_HOME_SCREEN_PRACTICE: 'homeScreenPractice'
    },
  },
  homeScreenPractice: {
    entry: 'homeScreenPractice',
    on: {
      ONTO_START_GAME: 'startGame',
      ONTO_HOME_SCREEN_PRACTICE:'homeScreenPractice',
    },
  },
  startGame: {
    entry: 'startGame',
    on: {
      ONTO_INCREMENT_ROUND: 'incrementRound'
    },
  },
  incrementRound: {
    entry: 'incrementRound',
    on: {
      ONTO_GENERATE_COLOR_ROUND: 'generateColorRound'
    },
  },
  prepareRoundN: {
    entry: 'prepareRoundN',
    on: {
      ONTO_ATTEMPTN: 'attemptN',
    },
  },
  generateColorRound: {
    entry: 'generateColorRound',
    on: {
      ONTO_HOMESCREEN_PRACTICE: 'homeScreenPractice',
      ONTO_PREPARE_ROUNDN: 'prepareRoundN',
    },
  },
  attemptN: {
    entry: 'attemptN',
    on: {
      RIGHT_GUESS_PLAYER_WINS: 'playerWinsConfettiFalls',
      WRONG_GUESS_ONTO_ATTEMPTN: 'attemptN',
      WRONG_GUESS_ONTO_PLAYER_LOOSES: 'playerLoosesShowSolution'
    },
  },
  playerWinsConfettiFalls: {
    entry: 'playerWinsConfettiFalls',
    on: {
      ONTO_INCREMENT_ROUND: 'incrementRound',
    },
    after: {
      3000: [
        {target: 'incrementRound'}
      ]
    }
  },
  playerLoosesShowSolution: {
    entry: 'playerLoosesShowSolution',
    on: {
      ONTO_INCREMENT_ROUND: 'incrementRound',
      NO_MORE_ROUNDS: 'gameOver',
    },
    after: {
      3000: [
        {target: 'incrementRound'},
        {target: 'gameOver'}
        ]
    }
  },
  gameOver: {
    entry: 'gameOver',
    on: {
      ONTO_LEADERBOARD: 'leaderboard',
      ONTO_SERVER_ERROR_NO_LEADERBOARD: 'noLeaderboard',
    },
  },
  leaderboard: {
    entry: 'leaderboard',
    on: {
      ONTO_START_GAME: 'generateColorRound',
    }
  },
    noLeaderboard: {
    entry: 'noLeaderboard',
    on: {
      ONTO_START_GAME: 'generateColorRound',
    }
  }
},
});

// console.log("twohueMachine.states.on.initializeApp:", twohueMachine.states.on.ONTO_INITIALIZE_APP)

export default twohueMachine;
