// ==============================
// The withStateMachine higher-order component accepts:
// 1) an Xstate configuration object or an Xstate machine,
// 2) some options,
// 3) and a component.

// It returns a NEW component with
// special props, action and activity methods and additional lifecycle hooks.

// The initial machine state and the initial data can be passed to
// the resulting component through the initialMachineState and initialData props.

// https://github.com/MicheleBertoli/react-automata
// ==============================



// ==============================
// React Automata State Chart
// States, TRANSITIONS, & Functions
// ==============================
const statechart = {
  initial: 'loading',
  states: {
    loading: {
      onEntry: 'readyAction',
      on: {
        READY: 'homeScreenPractice',
      },
    },
    homeScreenPractice: {
      onEntry: 'homeScreenPractice',
      on: {
        SELECT_COLOR_PRACTICE: 'homeScreenPractice',
        START_GAME: 'roundN',
      },
    },
    roundN: {
      onEntry: 'roundN',
      on: {
        INCREMENT_ROUND_COUNTER: 'incrementRoundCounter',
      },
    },
    incrementRoundCounter: {
      onEntry: 'incrementRoundCounter',
      on: {
        SET_UP_COLOR_ROUND: 'setUpColorRound',
      },
    },
    setUpColorRound: {
      onEntry: 'setUpColorRound',
      on: {
        PLAY_ROUND: 'playRound',
        NO_MORE_ROUNDS: 'gameOver',
      },
    },
    playRound: {
      onEntry: 'playRound',
      on: {
        ATTEMPT_N: 'attemptN',
      },
    },
    attemptN: {
      onEntry: 'attemptN',
      on: {
        SELECT_COLOR: 'checkSolution',
        OUT_OF_ATTEMPTS: 'playerLoosesRound',
      },
    },
    checkSolution: {
      onEntry: 'checkSolution',
      on: {
        CORRECT_SOLUTION: 'playerWinsRound',
        INCORRECT_SOLUTION: 'attemptN',
      },
    },
    playerWinsRound: {
      onEntry: 'playerWinsRound',
      on: {
        NEXT_ROUND: 'roundN',
        NO_MORE_ROUNDS: 'gameOver'
      },
    },
    playerLoosesRound: {
      onEntry: 'playerLoosesRound',
      on: {
        SHOW_SOLUTION: 'showSolution'
      },
    },
    showSolution: {
      onEntry: 'showSolution',
      on: {
        NEXT_ROUND: 'roundN',
        NO_MORE_ROUNDS: 'gameOver'
      },
    },
    gameOver: {
      onEntry: 'gameOver',
      on: {
        DO_NOT_JOIN_LEADERBOARD: 'leaderboard',
        JOIN_LEADERBOARD: 'joinLeaderboard'
      },
     },
    joinLeaderboard: {
      onEntry: 'joinLeaderboard',
      on: {
        FILLED_OUT_FORM: 'leaderboard'
      },
    },
    leaderboard: {
      onEntry: 'leaderboard',
      on: {
        PLAY_AGAIN: 'roundN',
        DONT_PLAY_AGAIN: 'homeScreenPractice'
      }
    }
}
}

export default statechart;