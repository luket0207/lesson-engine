import Button from '../../components/button/button';
import useDirectionalNavigation from '../../hooks/useDirectionalNavigation';

function getCompletionStage(sequence) {
  if (
    sequence.isAnimationRunning &&
    sequence.transitionKind === 'completion'
  ) {
    return sequence.transitionDirection === 'forward' ? 'entering' : 'exiting';
  }

  return sequence.completionButtonsVisible ? 'visible' : 'hidden';
}

function SpellingCompletionActions({ sequence }) {
  const handleDirectionalNavigation = useDirectionalNavigation();
  const stage = getCompletionStage(sequence);
  const controlsInteractive = stage === 'visible';
  const className = [
    'lets-spell-playback__completion-actions',
    `lets-spell-playback__completion-actions--${stage}`,
    sequence.hasNextItem
      ? 'lets-spell-playback__completion-actions--single'
      : '',
  ]
    .filter(Boolean)
    .join(' ');

  const handleAnimationEnd = (event) => {
    if (
      event.target === event.currentTarget &&
      (stage === 'entering' || stage === 'exiting')
    ) {
      sequence.completeAnimation();
    }
  };

  return (
    <div
      className={className}
      aria-hidden={!controlsInteractive}
      aria-label="Spelling navigation"
      onAnimationEnd={handleAnimationEnd}
      onKeyDown={handleDirectionalNavigation}
      role="group"
    >
      {sequence.hasNextItem ? (
        <Button
          data-directional-navigation-item=""
          onClick={sequence.nextItem}
          tabIndex={controlsInteractive ? undefined : -1}
          variant="secondary"
        >
          Next
        </Button>
      ) : (
        <>
          <Button
            data-directional-navigation-item=""
            tabIndex={controlsInteractive ? undefined : -1}
            to={`/letsSpell/${sequence.selectedCategory.id}`}
            variant="secondary"
          >
            Back to {sequence.selectedCategory.displayName}
          </Button>
          <Button
            data-directional-navigation-item=""
            tabIndex={controlsInteractive ? undefined : -1}
            to="/"
            variant="secondary"
          >
            Back to Home
          </Button>
        </>
      )}
    </div>
  );
}

export default SpellingCompletionActions;
