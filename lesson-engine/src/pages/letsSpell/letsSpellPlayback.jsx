import { useEffect, useId, useRef } from 'react';
import { Navigate, useLocation, useParams } from 'react-router-dom';
import { useAppShell } from '../../components/appShell/appShell';
import { PLAYBACK_MODES } from './createPlaybackSequence';
import SPELLING_CATEGORIES from './spellingCategories';
import SpellingCompletionActions from './spellingCompletionActions';
import SpellingDisplay from './spellingDisplay';
import {
  SPELLING_COMPLETION_ANIMATION_MS,
  SPELLING_IMAGE_ANIMATION_MS,
  SPELLING_LETTER_ANIMATION_MS,
} from './spellingTimings';
import useSpellingSequence from './useSpellingSequence';
import './spellingDisplay.scss';

const EXPECTED_MODE_COUNTS = {
  [PLAYBACK_MODES.RANDOM_THREE]: 3,
  [PLAYBACK_MODES.RANDOM_FIVE]: 5,
  [PLAYBACK_MODES.INDIVIDUAL]: 1,
};
const INTERACTIVE_TARGET_SELECTOR = [
  'a',
  'button',
  'input',
  'select',
  'textarea',
  '[contenteditable="true"]',
  '[role="button"]',
  '[role="link"]',
].join(',');

function eventTargetsInteractiveControl(event) {
  const interactiveControl = event.target.closest?.(INTERACTIVE_TARGET_SELECTOR);
  return interactiveControl && interactiveControl !== event.currentTarget;
}

function resolvePlaybackSession(categoryId, routeState) {
  const category = SPELLING_CATEGORIES.find(({ id }) => id === categoryId);

  if (!category) {
    return { redirectTo: '/letsSpell' };
  }

  const playbackMode = routeState?.playbackMode;
  const incomingItems = routeState?.items;
  const expectedItemCount =
    playbackMode === PLAYBACK_MODES.ALL
      ? category.items.length
      : EXPECTED_MODE_COUNTS[playbackMode];

  if (
    routeState?.categoryId !== category.id ||
    expectedItemCount === undefined ||
    !Array.isArray(incomingItems) ||
    incomingItems.length !== expectedItemCount
  ) {
    return { redirectTo: `/letsSpell/${category.id}` };
  }

  const categoryItemsById = new Map(category.items.map((item) => [item.id, item]));
  const itemIds = incomingItems.map((item) => item?.id);
  const orderedItems = itemIds.map((itemId) => categoryItemsById.get(itemId));

  if (
    new Set(itemIds).size !== itemIds.length ||
    orderedItems.some((item) => item === undefined)
  ) {
    return { redirectTo: `/letsSpell/${category.id}` };
  }

  return { category, orderedItems, playbackMode };
}

function SpellingPlaybackSession({ category, orderedItems, playbackMode }) {
  const { isOptionsOpen } = useAppShell();
  const instructionsId = useId();
  const playAreaRef = useRef(null);
  const sequence = useSpellingSequence({
    category,
    items: orderedItems,
    playbackMode,
  });
  const progressionDisabled = isOptionsOpen || sequence.isAnimationRunning;
  const characterCount = Math.max(sequence.currentCharacters.length, 1);
  const playbackStyle = {
    '--spelling-completion-animation-duration': `${SPELLING_COMPLETION_ANIMATION_MS}ms`,
    '--spelling-fit-size': `${75 / characterCount}vw`,
    '--spelling-image-animation-duration': `${SPELLING_IMAGE_ANIMATION_MS}ms`,
    '--spelling-letter-animation-duration': `${SPELLING_LETTER_ANIMATION_MS}ms`,
  };

  useEffect(() => {
    playAreaRef.current?.focus({ preventScroll: true });
  }, [sequence.currentItemIndex]);

  const requestForwardProgression = () => {
    if (sequence.completionButtonsVisible) {
      if (sequence.hasNextItem) {
        sequence.nextItem();
      }

      return;
    }

    sequence.requestForward();
  };

  const handleClick = (event) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      eventTargetsInteractiveControl(event)
    ) {
      return;
    }

    playAreaRef.current?.focus({ preventScroll: true });

    if (!progressionDisabled) {
      requestForwardProgression();
    }
  };

  const handleContextMenu = (event) => {
    if (eventTargetsInteractiveControl(event)) {
      return;
    }

    event.preventDefault();
    playAreaRef.current?.focus({ preventScroll: true });

    if (!progressionDisabled) {
      sequence.requestBackward();
    }
  };

  const handleKeyDown = (event) => {
    if (
      event.defaultPrevented ||
      event.repeat ||
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey ||
      eventTargetsInteractiveControl(event)
    ) {
      return;
    }

    const movesForward =
      event.key === 'ArrowRight' ||
      event.key === 'Enter' ||
      event.key === ' ' ||
      event.key === 'Spacebar';
    const movesBackward = event.key === 'ArrowLeft';

    if (!movesForward && !movesBackward) {
      return;
    }

    event.preventDefault();

    if (progressionDisabled) {
      return;
    }

    if (movesForward) {
      requestForwardProgression();
    } else {
      sequence.requestBackward();
    }
  };

  return (
    <main
      ref={playAreaRef}
      className="lets-spell-playback"
      aria-describedby={instructionsId}
      aria-label={`${sequence.currentItem.word} spelling activity`}
      data-completion-buttons-visible={sequence.completionButtonsVisible}
      data-current-item-index={sequence.currentItemIndex}
      data-reveal-stage={sequence.revealStage}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      onKeyDown={handleKeyDown}
      style={playbackStyle}
      tabIndex={0}
    >
      <SpellingDisplay
        completionActions={<SpellingCompletionActions sequence={sequence} />}
        sequence={sequence}
      />
      <p className="lets-spell-playback__assistive" id={instructionsId}>
        Click or tap the activity, or press Right Arrow, Enter, or Space, to move
        forward. Press Left Arrow or right-click the activity to move backward.
      </p>
      <p className="lets-spell-playback__assistive" aria-live="polite">
        Item {sequence.currentItemIndex + 1} of {sequence.orderedItems.length}:{' '}
        {sequence.currentItem.word}
      </p>
    </main>
  );
}

function LetsSpellPlayback() {
  const { categoryId } = useParams();
  const location = useLocation();
  const session = resolvePlaybackSession(categoryId, location.state);

  if (session.redirectTo) {
    return <Navigate replace to={session.redirectTo} />;
  }

  return <SpellingPlaybackSession {...session} />;
}

export default LetsSpellPlayback;
