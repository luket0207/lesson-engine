import { useEffect, useRef } from 'react';
import './countingWobble.scss';

function CountingNumber({
  advanceLabel,
  direction,
  interactive,
  number,
  onAdvance,
  onStageComplete,
  stage,
  word,
}) {
  const interactiveControlRef = useRef(null);
  const displayClassName = [
    'lets-count-page__counting-display',
    word
      ? 'lets-count-page__counting-display--with-word'
      : 'lets-count-page__counting-display--digit-only',
    interactive ? 'lets-count-page__counting-display--interactive' : '',
  ].join(' ');
  const digitClassName = [
    'lets-count-page__digit',
    `lets-count-page__digit--${direction}`,
    `lets-count-page__digit--${stage}`,
  ].join(' ');
  const spokenValue = word ? `${number}, ${word}` : `${number}`;

  useEffect(() => {
    if (interactive) {
      interactiveControlRef.current?.focus({ preventScroll: true });
    }
  }, [interactive, number]);

  const handleDigitAnimationEnd = (event) => {
    if (
      event.target === event.currentTarget &&
      (stage === 'entering' || stage === 'exiting')
    ) {
      onStageComplete();
    }
  };

  const content = (
    <>
      <span className="lets-count-page__digit-region" aria-hidden="true">
        <span className={digitClassName} onAnimationEnd={handleDigitAnimationEnd}>
          <span className={`counting-digit-wobble counting-digit-wobble--${direction}`}>
            {number}
          </span>
        </span>
      </span>

      {word && (
        <span className="lets-count-page__word-region" aria-hidden="true">
          <span
            className={`lets-count-page__word lets-count-page__word--${stage}`}
          >
            {word}
          </span>
        </span>
      )}
    </>
  );

  if (interactive) {
    return (
      <button
        ref={interactiveControlRef}
        className={displayClassName}
        aria-label={`${spokenValue}. ${advanceLabel}`}
        onClick={onAdvance}
        type="button"
      >
        {content}
      </button>
    );
  }

  return (
    <section
      className={displayClassName}
      aria-atomic="true"
      aria-label={spokenValue}
      aria-live="polite"
      role="status"
    >
      {content}
    </section>
  );
}

export default CountingNumber;
