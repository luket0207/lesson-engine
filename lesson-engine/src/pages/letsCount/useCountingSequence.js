import { useCallback, useReducer } from 'react';
import { generateCountingSequence, getNumberWord } from './countingSequence';

export const COUNTING_PHASES = Object.freeze({
  OPTIONS: 'options',
  INTRODUCTION_ENTERING: 'introduction-entering',
  INTRODUCTION_HOLDING: 'introduction-holding',
  INTRODUCTION_EXITING: 'introduction-exiting',
  NUMBER_ENTERING: 'number-entering',
  NUMBER_DISPLAYED: 'number-displayed',
  NUMBER_EXITING: 'number-exiting',
  FINISHED_ENTERING: 'finished-entering',
  FINISHED_DISPLAYED: 'finished-displayed',
});

const NUMBER_PHASES = new Set([
  COUNTING_PHASES.NUMBER_ENTERING,
  COUNTING_PHASES.NUMBER_DISPLAYED,
  COUNTING_PHASES.NUMBER_EXITING,
]);

const INITIAL_COUNTING_STATE = {
  phase: COUNTING_PHASES.OPTIONS,
  sequenceConfiguration: null,
  sequence: [],
  currentIndex: 0,
};

function countingSequenceReducer(state, action) {
  switch (action.type) {
    case 'START_SEQUENCE': {
      if (state.phase !== COUNTING_PHASES.OPTIONS) {
        return state;
      }

      const sequenceConfiguration = Object.freeze({ ...action.configuration });

      return {
        phase: COUNTING_PHASES.INTRODUCTION_ENTERING,
        sequenceConfiguration,
        sequence: generateCountingSequence(sequenceConfiguration),
        currentIndex: 0,
      };
    }

    case 'COMPLETE_PHASE': {
      if (state.phase !== action.phase) {
        return state;
      }

      switch (state.phase) {
        case COUNTING_PHASES.INTRODUCTION_ENTERING:
          return { ...state, phase: COUNTING_PHASES.INTRODUCTION_HOLDING };
        case COUNTING_PHASES.INTRODUCTION_HOLDING:
          return { ...state, phase: COUNTING_PHASES.INTRODUCTION_EXITING };
        case COUNTING_PHASES.INTRODUCTION_EXITING:
          return { ...state, phase: COUNTING_PHASES.NUMBER_ENTERING };
        case COUNTING_PHASES.NUMBER_ENTERING:
          return { ...state, phase: COUNTING_PHASES.NUMBER_DISPLAYED };
        case COUNTING_PHASES.NUMBER_EXITING:
          if (state.currentIndex === state.sequence.length - 1) {
            return { ...state, phase: COUNTING_PHASES.FINISHED_ENTERING };
          }

          return {
            ...state,
            phase: COUNTING_PHASES.NUMBER_ENTERING,
            currentIndex: state.currentIndex + 1,
          };
        case COUNTING_PHASES.FINISHED_ENTERING:
          return { ...state, phase: COUNTING_PHASES.FINISHED_DISPLAYED };
        default:
          return state;
      }
    }

    case 'REQUEST_NEXT':
      if (state.phase !== COUNTING_PHASES.NUMBER_DISPLAYED) {
        return state;
      }

      return { ...state, phase: COUNTING_PHASES.NUMBER_EXITING };

    case 'RETURN_TO_OPTIONS':
      return INITIAL_COUNTING_STATE;

    default:
      return state;
  }
}

function useCountingSequence() {
  const [state, dispatch] = useReducer(countingSequenceReducer, INITIAL_COUNTING_STATE);
  const isNumberPhase = NUMBER_PHASES.has(state.phase);
  const currentNumber = isNumberPhase ? state.sequence[state.currentIndex] : null;

  const startSequence = useCallback((configuration) => {
    dispatch({ type: 'START_SEQUENCE', configuration });
  }, []);

  const completePhase = useCallback((phase) => {
    dispatch({ type: 'COMPLETE_PHASE', phase });
  }, []);

  const requestNext = useCallback(() => {
    dispatch({ type: 'REQUEST_NEXT' });
  }, []);

  const returnToOptions = useCallback(() => {
    dispatch({ type: 'RETURN_TO_OPTIONS' });
  }, []);

  return {
    ...state,
    currentNumber,
    currentWord:
      currentNumber !== null && state.sequenceConfiguration?.words
        ? getNumberWord(currentNumber)
        : null,
    startSequence,
    completePhase,
    requestNext,
    returnToOptions,
  };
}

export default useCountingSequence;
