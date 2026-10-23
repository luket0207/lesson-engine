export const BOXES_GAME_PHASES = Object.freeze({
  INTRODUCTION_ENTERING: 'introduction-entering',
  INTRODUCTION_READY: 'introduction-ready',
  INTRODUCTION_EXITING: 'introduction-exiting',
  BOXES_ENTERING: 'boxes-entering',
  BOX_LABELS_ENTERING: 'box-labels-entering',
  BOXES_READY: 'boxes-ready',
  START_EXITING: 'start-exiting',
  OBJECT_ENTERING: 'object-entering',
  OBJECT_WIGGLING: 'object-wiggling',
  BOXES_HIDING_OBJECT: 'boxes-hiding-object',
  GUESSING_READY: 'guessing-ready',
  INCORRECT_GUESS_FEEDBACK: 'incorrect-guess-feedback',
  CORRECT_GUESS_REVEAL: 'correct-guess-reveal',
  SUCCESS_ANIMATION: 'success-animation',
  SUCCESS_HOLDING: 'success-holding',
  COMPLETED: 'completed',
});

export const BOXES_GAME_ACTIONS = Object.freeze({
  BEGIN_BOX_ENTRANCE: 'begin-box-entrance',
  BEGIN_OBJECT_ENTRANCE: 'begin-object-entrance',
  COMPLETE_PHASE: 'complete-phase',
  SELECT_BOX: 'select-box',
});

const ANIMATED_PHASES = new Set([
  BOXES_GAME_PHASES.INTRODUCTION_ENTERING,
  BOXES_GAME_PHASES.INTRODUCTION_EXITING,
  BOXES_GAME_PHASES.BOXES_ENTERING,
  BOXES_GAME_PHASES.BOX_LABELS_ENTERING,
  BOXES_GAME_PHASES.START_EXITING,
  BOXES_GAME_PHASES.OBJECT_ENTERING,
  BOXES_GAME_PHASES.OBJECT_WIGGLING,
  BOXES_GAME_PHASES.BOXES_HIDING_OBJECT,
  BOXES_GAME_PHASES.INCORRECT_GUESS_FEEDBACK,
  BOXES_GAME_PHASES.CORRECT_GUESS_REVEAL,
  BOXES_GAME_PHASES.SUCCESS_ANIMATION,
]);

const INTERACTIVE_PHASES = new Set([
  BOXES_GAME_PHASES.INTRODUCTION_READY,
  BOXES_GAME_PHASES.BOXES_READY,
  BOXES_GAME_PHASES.GUESSING_READY,
  BOXES_GAME_PHASES.COMPLETED,
]);

const COMPLETED_PHASE_TRANSITIONS = Object.freeze({
  [BOXES_GAME_PHASES.INTRODUCTION_ENTERING]:
    BOXES_GAME_PHASES.INTRODUCTION_READY,
  [BOXES_GAME_PHASES.INTRODUCTION_EXITING]: BOXES_GAME_PHASES.BOXES_ENTERING,
  [BOXES_GAME_PHASES.BOXES_ENTERING]: BOXES_GAME_PHASES.BOXES_READY,
  [BOXES_GAME_PHASES.BOX_LABELS_ENTERING]: BOXES_GAME_PHASES.BOXES_READY,
  [BOXES_GAME_PHASES.START_EXITING]: BOXES_GAME_PHASES.OBJECT_ENTERING,
  [BOXES_GAME_PHASES.OBJECT_ENTERING]: BOXES_GAME_PHASES.OBJECT_WIGGLING,
  [BOXES_GAME_PHASES.OBJECT_WIGGLING]: BOXES_GAME_PHASES.BOXES_HIDING_OBJECT,
  [BOXES_GAME_PHASES.BOXES_HIDING_OBJECT]: BOXES_GAME_PHASES.GUESSING_READY,
  [BOXES_GAME_PHASES.INCORRECT_GUESS_FEEDBACK]:
    BOXES_GAME_PHASES.GUESSING_READY,
  [BOXES_GAME_PHASES.CORRECT_GUESS_REVEAL]:
    BOXES_GAME_PHASES.SUCCESS_ANIMATION,
  [BOXES_GAME_PHASES.SUCCESS_ANIMATION]: BOXES_GAME_PHASES.SUCCESS_HOLDING,
  [BOXES_GAME_PHASES.SUCCESS_HOLDING]: BOXES_GAME_PHASES.COMPLETED,
});

function transitionToPhase(state, phase, additionalState = {}) {
  return {
    ...state,
    ...additionalState,
    phase,
    isAnimationRunning: ANIMATED_PHASES.has(phase),
    inputPermitted: INTERACTIVE_PHASES.has(phase),
  };
}

export function createBoxesGameState(game) {
  return transitionToPhase(
    {
      roundId: game.roundId,
      object: { ...game.object },
      objectCategory: game.settings.objectCategory,
      boxCount: game.settings.boxCount,
      boxNames: game.settings.boxNames,
      boxes: game.boxes.map((box) => ({ ...box })),
      correctBoxId: game.correctBoxId,
      objectEntrancePosition: { ...game.objectEntrancePosition },
      selectedBoxId: null,
    },
    BOXES_GAME_PHASES.INTRODUCTION_ENTERING,
  );
}

export function boxesGameReducer(state, action) {
  if (action.roundId !== state.roundId) {
    return state;
  }

  switch (action.type) {
    case BOXES_GAME_ACTIONS.COMPLETE_PHASE: {
      if (action.phase !== state.phase) {
        return state;
      }

      const nextPhase =
        state.phase === BOXES_GAME_PHASES.BOXES_ENTERING && state.boxNames
          ? BOXES_GAME_PHASES.BOX_LABELS_ENTERING
          : COMPLETED_PHASE_TRANSITIONS[state.phase];

      if (!nextPhase) {
        return state;
      }

      return transitionToPhase(state, nextPhase, {
        selectedBoxId:
          state.phase === BOXES_GAME_PHASES.INCORRECT_GUESS_FEEDBACK
            ? null
            : state.selectedBoxId,
      });
    }

    case BOXES_GAME_ACTIONS.BEGIN_BOX_ENTRANCE:
      if (state.phase !== BOXES_GAME_PHASES.INTRODUCTION_READY) {
        return state;
      }

      return transitionToPhase(state, BOXES_GAME_PHASES.INTRODUCTION_EXITING);

    case BOXES_GAME_ACTIONS.BEGIN_OBJECT_ENTRANCE:
      if (state.phase !== BOXES_GAME_PHASES.BOXES_READY) {
        return state;
      }

      return transitionToPhase(state, BOXES_GAME_PHASES.START_EXITING);

    case BOXES_GAME_ACTIONS.SELECT_BOX: {
      if (
        state.phase !== BOXES_GAME_PHASES.GUESSING_READY ||
        !state.boxes.some((box) => box.id === action.boxId)
      ) {
        return state;
      }

      const guessPhase =
        action.boxId === state.correctBoxId
          ? BOXES_GAME_PHASES.CORRECT_GUESS_REVEAL
          : BOXES_GAME_PHASES.INCORRECT_GUESS_FEEDBACK;

      return transitionToPhase(state, guessPhase, {
        selectedBoxId: action.boxId,
      });
    }

    default:
      return state;
  }
}
