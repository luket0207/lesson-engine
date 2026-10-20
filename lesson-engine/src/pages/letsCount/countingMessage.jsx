import { useEffect } from 'react';

function CountingMessage({
  children,
  holdDuration,
  onStageComplete,
  paused = false,
  stage,
  text,
}) {
  useEffect(() => {
    if (paused || stage !== 'holding' || holdDuration === undefined) {
      return undefined;
    }

    const holdTimer = window.setTimeout(onStageComplete, holdDuration);

    return () => window.clearTimeout(holdTimer);
  }, [holdDuration, onStageComplete, paused, stage]);

  const handleAnimationEnd = (event) => {
    if (
      !paused &&
      event.target === event.currentTarget &&
      (stage === 'entering' || stage === 'exiting')
    ) {
      onStageComplete();
    }
  };

  return (
    <section
      className="lets-count-page__sequence-screen"
      aria-atomic="true"
      aria-live="polite"
    >
      <h1
        className={`lets-count-page__message lets-count-page__message--${stage}`}
        onAnimationEnd={handleAnimationEnd}
      >
        {text}
      </h1>
      {children}
    </section>
  );
}

export default CountingMessage;
