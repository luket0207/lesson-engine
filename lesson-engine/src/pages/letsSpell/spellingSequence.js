export const SPELLING_SEQUENCE_ACTIONS = Object.freeze({
  COMPLETE_ANIMATION: 'complete-animation',
  NEXT_ITEM: 'next-item',
  REQUEST_BACKWARD: 'request-backward',
  REQUEST_FORWARD: 'request-forward',
});

export function createSpellingCharacters(word) {
  let letterIndex = 0;

  return Array.from(word).map((character, characterIndex) => {
    const isSpace = character === ' ';
    const spellingCharacter = {
      character,
      characterIndex,
      isSpace,
      letterIndex: isSpace ? null : letterIndex,
    };

    if (!isSpace) {
      letterIndex += 1;
    }

    return spellingCharacter;
  });
}

export function getSpellingLetterCount(word) {
  return createSpellingCharacters(word).filter(({ isSpace }) => !isSpace).length;
}

export function getFinalRevealStage(word) {
  return getSpellingLetterCount(word) + 1;
}

export function createSpellingSequenceState({
  category,
  items,
  playbackMode,
}) {
  return {
    selectedCategory: category,
    playbackMode,
    orderedItems: [...items],
    currentItemIndex: 0,
    revealStage: 1,
    completionButtonsVisible: false,
    isAnimationRunning: true,
    transitionDirection: 'forward',
    transitionKind: 'reveal',
  };
}

export function spellingSequenceReducer(state, action) {
  const currentItem = state.orderedItems[state.currentItemIndex];

  switch (action.type) {
    case SPELLING_SEQUENCE_ACTIONS.REQUEST_FORWARD: {
      if (state.isAnimationRunning) {
        return state;
      }

      const finalRevealStage = getFinalRevealStage(currentItem.word);

      if (state.revealStage < finalRevealStage) {
        return {
          ...state,
          revealStage: state.revealStage + 1,
          isAnimationRunning: true,
          transitionDirection: 'forward',
          transitionKind: 'reveal',
        };
      }

      if (!state.completionButtonsVisible) {
        return {
          ...state,
          completionButtonsVisible: true,
          isAnimationRunning: true,
          transitionDirection: 'forward',
          transitionKind: 'completion',
        };
      }

      return state;
    }

    case SPELLING_SEQUENCE_ACTIONS.REQUEST_BACKWARD:
      if (state.isAnimationRunning) {
        return state;
      }

      if (state.completionButtonsVisible) {
        return {
          ...state,
          completionButtonsVisible: false,
          isAnimationRunning: true,
          transitionDirection: 'backward',
          transitionKind: 'completion',
        };
      }

      if (state.revealStage > 1) {
        return {
          ...state,
          revealStage: state.revealStage - 1,
          isAnimationRunning: true,
          transitionDirection: 'backward',
          transitionKind: 'reveal',
        };
      }

      return state;

    case SPELLING_SEQUENCE_ACTIONS.COMPLETE_ANIMATION:
      if (!state.isAnimationRunning) {
        return state;
      }

      return {
        ...state,
        isAnimationRunning: false,
        transitionDirection: null,
        transitionKind: null,
      };

    case SPELLING_SEQUENCE_ACTIONS.NEXT_ITEM:
      if (
        state.isAnimationRunning ||
        !state.completionButtonsVisible ||
        state.currentItemIndex >= state.orderedItems.length - 1
      ) {
        return state;
      }

      return {
        ...state,
        currentItemIndex: state.currentItemIndex + 1,
        revealStage: 1,
        completionButtonsVisible: false,
        isAnimationRunning: true,
        transitionDirection: 'forward',
        transitionKind: 'reveal',
      };

    default:
      return state;
  }
}
