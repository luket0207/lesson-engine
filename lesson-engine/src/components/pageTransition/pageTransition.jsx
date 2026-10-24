import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './pageTransition.scss';

const TRANSITION_DURATION_MS = 250;
const TRANSITION_FALLBACK_BUFFER_MS = 50;

function PageTransition({ children }) {
  const location = useLocation();
  const [displayedLocation, setDisplayedLocation] = useState(location);
  const [phase, setPhase] = useState('entering');
  const pendingLocationRef = useRef(location);
  const shouldFocusIncomingRef = useRef(false);
  const transitionRef = useRef(null);

  useEffect(() => {
    pendingLocationRef.current = location;

    if (location.key === displayedLocation.key) {
      return;
    }

    shouldFocusIncomingRef.current = true;

    const activeElement = document.activeElement;
    if (transitionRef.current?.contains(activeElement)) {
      activeElement.blur();
    }

    setPhase('exiting');
  }, [displayedLocation.key, location]);

  const completePhase = useCallback((completedPhase) => {
    if (completedPhase === 'exiting') {
      setDisplayedLocation(pendingLocationRef.current);
      setPhase('entering');
      return;
    }

    if (completedPhase === 'entering') {
      setPhase('idle');

      if (shouldFocusIncomingRef.current) {
        shouldFocusIncomingRef.current = false;
        window.requestAnimationFrame(() => {
          transitionRef.current?.focus({ preventScroll: true });
        });
      }
    }
  }, []);

  useEffect(() => {
    if (phase === 'idle') {
      return undefined;
    }

    const fallbackTimer = window.setTimeout(
      () => completePhase(phase),
      TRANSITION_DURATION_MS + TRANSITION_FALLBACK_BUFFER_MS,
    );

    return () => window.clearTimeout(fallbackTimer);
  }, [completePhase, phase]);

  const handleAnimationEnd = (event) => {
    if (event.target === event.currentTarget) {
      completePhase(phase);
    }
  };

  const isTransitioning = phase !== 'idle';

  return (
    <div
      ref={transitionRef}
      className={`page-transition page-transition--${phase}`}
      aria-hidden={isTransitioning ? 'true' : undefined}
      inert={isTransitioning ? true : undefined}
      onAnimationEnd={handleAnimationEnd}
      tabIndex={-1}
    >
      {children(displayedLocation)}
    </div>
  );
}

export default PageTransition;
