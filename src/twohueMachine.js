import { createMachine } from 'xstate';

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
      ONTO_HOMESCREEN_PRACTICE: 'homeScreenPracticeState'
    },
  },
  homeScreenPracticeState: {
    entry: 'homeScreenPractice',
    on: {
      ONTO_START_GAME: 'startGameState'
    },
  },
  startGameState: {
    entry: 'startGame',
    on: {
      ONTO_INCREMENT_ROUND: 'incrementRoundState'
    },
  },
  incrementRoundState: {
    entry: 'incrementRound',
    on: {
      ONTO_GENERATE_COLOR_ROUND: 'generateColorRoundState'
    },
  },
  prepareRoundNState: {
    entry: 'prepareRoundN',
    on: {
      ONTO_ATTEMPTN: 'attemptNState',
    },
  },
  generateColorRoundState: {
    entry: 'generateColorRound',
    on: {
      ONTO_PREPARE_ROUNDN: 'prepareRoundNState'
    },
  },
  attemptNState: {
    entry: 'attemptN',
    on: {
      RIGHT_GUESS_PLAYER_WINS: 'playerWinsConfettiFallsState',
      WRONG_GUESS_ONTO_ATTEMPTN: 'attemptNState',
      WRONG_GUESS_ONTO_PLAYER_LOOSES: 'playerLoosesShowSolutionState'
    },
  },
  playerWinsConfettiFallsState: {
    entry: 'playerWinsConfettiFalls',
    on: {
      ONTO_INCREMENT_ROUND: 'incrementRoundState',
    },
    after: {
      3000: [
        {target: 'incrementRoundState'}
      ]
    }
  },
  playerLoosesShowSolutionState: {
    entry: 'playerLoosesShowSolution',
    on: {
      ONTO_INCREMENT_ROUND: 'incrementRoundState',
      NO_MORE_ROUNDS: 'gameOverState',
    },
    after: {
      3000: [
        {target: 'incrementRoundState'},
        {target: 'gameOverState'}
        ]
    }
  },
  gameOverState: {
    entry: 'gameOver',
    on: {
      ONTO_LEADERBOARD: 'leaderboardState',
      ONTO_SERVER_ERROR_NO_LEADERBOARD: 'noLeaderboardState',
    },
  },
  leaderboardState: {
    entry: 'leaderboard',
    on: {
      ONTO_START_GAME: 'generateColorRoundState',
    }
  },
  noLeaderboardState: {
    entry: 'noLeaderboard',
    on: {
      ONTO_START_GAME: 'generateColorRoundState',
    }
  }
},
});

export default twohueMachine;
