import { useCallback, useMemo, useReducer } from 'react';
import {
  createSpellingCharacters,
  createSpellingSequenceState,
  getFinalRevealStage,
  SPELLING_SEQUENCE_ACTIONS,
  spellingSequenceReducer,
} from './spellingSequence';

function useSpellingSequence(configuration) {
  const [state, dispatch] = useReducer(
    spellingSequenceReducer,
    configuration,
    createSpellingSequenceState,
  );
  const currentItem = state.orderedItems[state.currentItemIndex];
  const currentCharacters = useMemo(
    () => createSpellingCharacters(currentItem.word),
    [currentItem.word],
  );
  const finalRevealStage = getFinalRevealStage(currentItem.word);

  const requestForward = useCallback(() => {
    dispatch({ type: SPELLING_SEQUENCE_ACTIONS.REQUEST_FORWARD });
  }, []);

  const requestBackward = useCallback(() => {
    dispatch({ type: SPELLING_SEQUENCE_ACTIONS.REQUEST_BACKWARD });
  }, []);

  const completeAnimation = useCallback(() => {
    dispatch({ type: SPELLING_SEQUENCE_ACTIONS.COMPLETE_ANIMATION });
  }, []);

  const nextItem = useCallback(() => {
    dispatch({ type: SPELLING_SEQUENCE_ACTIONS.NEXT_ITEM });
  }, []);

  return {
    ...state,
    completeAnimation,
    currentCharacters,
    currentItem,
    finalRevealStage,
    hasNextItem: state.currentItemIndex < state.orderedItems.length - 1,
    imageVisible: state.revealStage >= 1,
    nextItem,
    requestBackward,
    requestForward,
    visibleLetterCount: Math.max(0, state.revealStage - 1),
  };
}

export default useSpellingSequence;
