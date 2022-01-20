import { Machine } from 'xstate';

// ==============================
// https://xstate.js.org/viz/?gist=164f6bb8dff9841e0b57f244f214826c
// ==============================
const twohueMachine = new Machine({
  id: 'twohue',
  initial: 'loading',
  states: {
    loading: {
      on: {
        APP_LOADS: 'homeScreenPractice',
      },
  },
  homeScreenPractice: {
    onEntry: 'homeScreenPractice',
    on: {
      SELECT_COLOR_PRACTICE: 'homeScreenPractice',
      ONTO_GENERATE_COLOR_ROUND: 'generateColorRound',
    },
  },
  generateColorRound: {
    onEntry: 'generateColorRound',
    on: {
      ONTO_TO_ROUNDN: 'roundN',
    },
  },
  roundN: {
    onEntry: 'roundN',
    on: {
      ONTO_ATTEMPTN: 'attemptN',
    },
  },
  attemptN: {
    onEntry: 'attemptN',
    on: {
      RIGHT_GUESS_PLAYER_WINS: 'playerWins',
      WRONG_GUESS_ONTO_ATTEMPTN: 'attemptN',
      WRONG_GUESS_ONTO_PLAYER_LOOSES: 'playerLoosesShowSolution'
    },
  },
  playerWins: {
    onEntry: 'playerWins',
    on: {
      ONTO_ROUNDN: 'roundN',
      NO_MORE_ROUNDS: 'gameOver',
    },
  },
  playerLoosesShowSolution: {
    onEntry: 'playerLoosesShowSolution',
    on: {
      ONTO_GENERATE_COLOR_ROUND: 'generateColorRound',
      NO_MORE_ROUNDS: 'gameOver',
    },
  },
  gameOver: {
    onEntry: 'gameOver',
    on: {
      ONTO_LEADERBOARD: 'leaderboard',
      ONTO_SERVER_ERROR_NO_LEADERBOARD: 'noLeaderboard',
    },
  },
  leaderboard: {
    onEntry: 'leaderboard',
    on: {
      ONTO_START_GAME: 'generateColorRound',
    }
  },
    noLeaderboard: {
    onEntry: 'noLeaderboard',
    on: {
      ONTO_START_GAME: 'generateColorRound',
    }
  }
}
});

export default twohueMachine;
