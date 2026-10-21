import { useEffect, useId, useLayoutEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import Button from '../../components/button/button';
import useDirectionalNavigation from '../../hooks/useDirectionalNavigation';
import { BOXES_GAME_PHASES } from './boxesGameState';
import {
  BOXES_COMPLETION_FADE_MS,
  BOXES_CORRECT_REVEAL_MS,
  BOXES_ENTRANCE_MS,
  BOXES_FLIP_MS,
  BOXES_HIDE_MS,
  BOXES_INCORRECT_FEEDBACK_MS,
  BOXES_INSTRUCTION_FADE_MS,
  BOXES_INTRODUCTION_BOUNCE_MS,
  BOXES_INTRODUCTION_EXIT_MS,
  BOXES_OBJECT_ENTRANCE_MS,
  BOXES_OBJECT_WIGGLE_MS,
  BOXES_LOWER_MS,
  BOXES_START_FADE_MS,
  BOXES_SUCCESS_HOLD_MS,
  BOXES_SUCCESS_OBJECT_GROW_MS,
} from './boxesGameTimings';

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
const OBJECT_HIDING_MAX_DIMENSION_PX = 200;

function eventTargetsInteractiveControl(event) {
  const interactiveControl = event.target.closest?.(INTERACTIVE_TARGET_SELECTOR);
  return interactiveControl && interactiveControl !== event.currentTarget;
}

function BoxesGameScene({
  gameState,
  onBackToHome,
  onBackToLetsFind,
  onPlayAgain,
}) {
  const playAreaRef = useRef(null);
  const sceneRef = useRef(null);
  const completionRegionRef = useRef(null);
  const boxButtonRefs = useRef({});
  const lastFocusedBoxIdRef = useRef(null);
  const handleDirectionalNavigation = useDirectionalNavigation(
    '.lets-find-boxes-game__box-button',
  );
  const handleCompletionNavigation = useDirectionalNavigation();
  const completePhase = gameState.completePhase;
  const currentPhase = gameState.phase;
  const instructionsId = useId();
  const introductionPhase = gameState.phase.startsWith('introduction-')
    ? gameState.phase.replace('introduction-', '')
    : 'hidden';
  const boxesPhase =
    gameState.phase === BOXES_GAME_PHASES.BOXES_ENTERING
      ? 'entering'
      : gameState.phase === BOXES_GAME_PHASES.BOXES_HIDING_OBJECT
        ? 'hiding'
        : gameState.phase === BOXES_GAME_PHASES.CORRECT_GUESS_REVEAL
          ? 'correct-reveal'
        : [
              BOXES_GAME_PHASES.SUCCESS_ANIMATION,
              BOXES_GAME_PHASES.SUCCESS_HOLDING,
              BOXES_GAME_PHASES.COMPLETED,
            ].includes(gameState.phase)
          ? 'faded'
          : [
                BOXES_GAME_PHASES.GUESSING_READY,
                BOXES_GAME_PHASES.INCORRECT_GUESS_FEEDBACK,
              ].includes(gameState.phase)
            ? 'lowered'
      : introductionPhase === 'hidden'
        ? 'visible'
        : 'hidden';
  const startPhase =
    gameState.phase === BOXES_GAME_PHASES.BOXES_READY
      ? 'ready'
      : gameState.phase === BOXES_GAME_PHASES.START_EXITING
        ? 'exiting'
        : 'hidden';
  const objectPhase =
    gameState.phase === BOXES_GAME_PHASES.CORRECT_GUESS_REVEAL
      ? 'revealing'
      : gameState.phase === BOXES_GAME_PHASES.SUCCESS_ANIMATION
        ? 'celebrating'
        : [
              BOXES_GAME_PHASES.SUCCESS_HOLDING,
              BOXES_GAME_PHASES.COMPLETED,
            ].includes(gameState.phase)
          ? 'celebrated'
      : gameState.phase === BOXES_GAME_PHASES.OBJECT_ENTERING
      ? 'entering'
      : gameState.phase === BOXES_GAME_PHASES.OBJECT_WIGGLING
        ? 'wiggling'
        : gameState.phase === BOXES_GAME_PHASES.BOXES_HIDING_OBJECT
          ? 'hiding'
          : boxesPhase === 'lowered'
            ? 'concealed'
            : 'hidden';
  const successPhase =
    gameState.phase === BOXES_GAME_PHASES.SUCCESS_ANIMATION
      ? 'animating'
      : [
            BOXES_GAME_PHASES.SUCCESS_HOLDING,
            BOXES_GAME_PHASES.COMPLETED,
          ].includes(gameState.phase)
        ? 'visible'
        : 'hidden';
  const canAdvance =
    gameState.inputPermitted &&
    (gameState.phase === BOXES_GAME_PHASES.INTRODUCTION_READY ||
      gameState.phase === BOXES_GAME_PHASES.BOXES_READY);
  const boxSelectionEnabled =
    gameState.phase === BOXES_GAME_PHASES.GUESSING_READY &&
    gameState.inputPermitted;
  const instructionVisible =
    gameState.phase === BOXES_GAME_PHASES.GUESSING_READY ||
    gameState.phase === BOXES_GAME_PHASES.INCORRECT_GUESS_FEEDBACK;
  const completionVisible = gameState.phase === BOXES_GAME_PHASES.COMPLETED;
  const completionInputPermitted =
    completionVisible && gameState.inputPermitted;
  const introductionText = `Let's find the ${gameState.object.displayName}!`;
  const successText = `We found the ${gameState.object.displayName}!`;
  const animationStyle = {
    '--boxes-completion-fade-duration': `${BOXES_COMPLETION_FADE_MS}ms`,
    '--boxes-correct-reveal-duration': `${BOXES_CORRECT_REVEAL_MS}ms`,
    '--boxes-entrance-duration': `${BOXES_ENTRANCE_MS}ms`,
    '--boxes-flip-duration': `${BOXES_FLIP_MS}ms`,
    '--boxes-lower-duration': `${BOXES_LOWER_MS}ms`,
    '--boxes-incorrect-feedback-duration': `${BOXES_INCORRECT_FEEDBACK_MS}ms`,
    '--boxes-instruction-fade-duration': `${BOXES_INSTRUCTION_FADE_MS}ms`,
    '--boxes-introduction-bounce-duration': `${BOXES_INTRODUCTION_BOUNCE_MS}ms`,
    '--boxes-introduction-exit-duration': `${BOXES_INTRODUCTION_EXIT_MS}ms`,
    '--boxes-introduction-fit-size': `${100 / introductionText.length}vw`,
    '--boxes-object-entrance-duration': `${BOXES_OBJECT_ENTRANCE_MS}ms`,
    '--boxes-object-max-height': `${OBJECT_HIDING_MAX_DIMENSION_PX}px`,
    '--boxes-object-max-width': `${OBJECT_HIDING_MAX_DIMENSION_PX}px`,
    '--boxes-object-wiggle-duration': `${BOXES_OBJECT_WIGGLE_MS}ms`,
    '--boxes-start-fade-duration': `${BOXES_START_FADE_MS}ms`,
    '--boxes-success-fit-size': `${76 / successText.length}vw`,
    '--boxes-success-object-grow-duration': `${BOXES_SUCCESS_OBJECT_GROW_MS}ms`,
  };

  useEffect(() => {
    playAreaRef.current?.focus({ preventScroll: true });
  }, [gameState.roundId]);

  useEffect(() => {
    const lastFocusedBoxId = lastFocusedBoxIdRef.current;

    if (boxSelectionEnabled && lastFocusedBoxId) {
      boxButtonRefs.current[lastFocusedBoxId]?.focus({ preventScroll: true });
    }
  }, [boxSelectionEnabled]);

  useEffect(() => {
    if (currentPhase !== BOXES_GAME_PHASES.SUCCESS_HOLDING) {
      return undefined;
    }

    const completionDelay = window.setTimeout(() => {
      completePhase(BOXES_GAME_PHASES.SUCCESS_HOLDING);
    }, BOXES_SUCCESS_HOLD_MS);

    return () => window.clearTimeout(completionDelay);
  }, [completePhase, currentPhase]);

  useEffect(() => {
    if (completionInputPermitted) {
      completionRegionRef.current
        ?.querySelector('[data-directional-navigation-item]')
        ?.focus({ preventScroll: true });
    }
  }, [completionInputPermitted]);

  useLayoutEffect(() => {
    const scene = sceneRef.current;
    const correctBox = scene?.querySelector(
      `[data-box-id="${gameState.correctBoxId}"]`,
    );

    if (!scene || !correctBox) {
      return undefined;
    }

    const positionSceneElements = () => {
      const sceneBounds = scene.getBoundingClientRect();
      const boxesRowBounds = correctBox.parentElement.getBoundingClientRect();
      const boxWidth = correctBox.offsetWidth;
      const boxHeight = correctBox.offsetHeight;
      const objectWidth = Math.min(
        OBJECT_HIDING_MAX_DIMENSION_PX,
        boxWidth * 0.72,
      );
      const objectHeight = Math.min(
        OBJECT_HIDING_MAX_DIMENSION_PX,
        boxHeight * 0.72,
      );
      const boxViewportLeft = boxesRowBounds.left + correctBox.offsetLeft;
      const boxViewportTop = boxesRowBounds.top + correctBox.offsetTop;
      const targetViewportX = boxViewportLeft + boxWidth / 2;
      const targetViewportY = sceneBounds.top + sceneBounds.height / 2;
      const startViewportX =
        (window.innerWidth * gameState.objectEntrancePosition.leftPercent) / 100;
      const startViewportY =
        (window.innerHeight * gameState.objectEntrancePosition.topVh) / 100 +
        objectHeight / 2;

      scene.style.setProperty(
        '--boxes-object-target-left',
        `${targetViewportX - sceneBounds.left}px`,
      );
      scene.style.setProperty('--boxes-object-width', `${objectWidth}px`);
      scene.style.setProperty('--boxes-object-height', `${objectHeight}px`);
      scene.style.setProperty(
        '--boxes-object-start-x',
        `${startViewportX - targetViewportX}px`,
      );
      scene.style.setProperty(
        '--boxes-object-start-y',
        `${startViewportY - targetViewportY}px`,
      );
      scene.style.setProperty(
        '--boxes-hide-distance',
        `${targetViewportY - (boxViewportTop + boxHeight / 2)}px`,
      );
    };

    positionSceneElements();
    window.addEventListener('resize', positionSceneElements);

    return () => window.removeEventListener('resize', positionSceneElements);
  }, [
    gameState.correctBoxId,
    gameState.objectEntrancePosition.leftPercent,
    gameState.objectEntrancePosition.topVh,
    gameState.roundId,
  ]);

  const requestAdvance = () => {
    if (!canAdvance) {
      return;
    }

    if (gameState.phase === BOXES_GAME_PHASES.INTRODUCTION_READY) {
      gameState.beginBoxEntrance();
    } else if (gameState.phase === BOXES_GAME_PHASES.BOXES_READY) {
      gameState.beginObjectEntrance();
    }
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
    requestAdvance();
  };

  const handleKeyDown = (event) => {
    if (
      event.defaultPrevented ||
      event.repeat ||
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey ||
      eventTargetsInteractiveControl(event) ||
      (event.key !== 'Enter' && event.key !== ' ' && event.key !== 'Spacebar') ||
      !canAdvance
    ) {
      return;
    }

    event.preventDefault();
    requestAdvance();
  };

  const handleIntroductionAnimationEnd = (event) => {
    if (
      event.target === event.currentTarget &&
      (gameState.phase === BOXES_GAME_PHASES.INTRODUCTION_ENTERING ||
        gameState.phase === BOXES_GAME_PHASES.INTRODUCTION_EXITING)
    ) {
      gameState.completePhase(gameState.phase);
    }
  };

  const handleStartAnimationEnd = (event) => {
    if (
      event.target === event.currentTarget &&
      gameState.phase === BOXES_GAME_PHASES.START_EXITING
    ) {
      gameState.completePhase(BOXES_GAME_PHASES.START_EXITING);
    }
  };

  const handleObjectAnimationEnd = (event) => {
    if (
      event.target === event.currentTarget &&
      (gameState.phase === BOXES_GAME_PHASES.OBJECT_ENTERING ||
        gameState.phase === BOXES_GAME_PHASES.OBJECT_WIGGLING)
    ) {
      gameState.completePhase(gameState.phase);
    }
  };

  return (
    <main
      ref={playAreaRef}
      className="lets-find-boxes-game"
      aria-describedby={instructionsId}
      aria-label={`Find the ${gameState.object.displayName} game`}
      data-animation-running={gameState.isAnimationRunning}
      data-box-count={gameState.boxCount}
      data-input-permitted={gameState.inputPermitted}
      data-phase={gameState.phase}
      data-round-id={gameState.roundId}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      style={animationStyle}
      tabIndex={0}
    >
      <div ref={sceneRef} className="lets-find-boxes-game__scene">
        <section className="lets-find-boxes-game__introduction-region">
          <h1
            className={`lets-find-boxes-game__introduction lets-find-boxes-game__introduction--${introductionPhase}`}
            onAnimationEnd={handleIntroductionAnimationEnd}
          >
            {introductionText}
          </h1>
        </section>

        <section
          className={`lets-find-boxes-game__boxes-region lets-find-boxes-game__boxes-region--${boxesPhase}`}
          aria-hidden={boxesPhase === 'hidden' || boxesPhase === 'faded'}
          onAnimationEnd={(event) => {
            if (
              event.target === event.currentTarget &&
              gameState.phase === BOXES_GAME_PHASES.CORRECT_GUESS_REVEAL
            ) {
              gameState.completePhase(
                BOXES_GAME_PHASES.CORRECT_GUESS_REVEAL,
              );
            }
          }}
        >
          <div
            className="lets-find-boxes-game__boxes-row"
            aria-label="Choose a box"
            onKeyDown={handleDirectionalNavigation}
            role="group"
          >
            {gameState.boxes.map((box) => {
              const isIncorrectBox =
                gameState.phase ===
                  BOXES_GAME_PHASES.INCORRECT_GUESS_FEEDBACK &&
                gameState.selectedBoxId === box.id;
              const isCorrectBox =
                gameState.phase === BOXES_GAME_PHASES.CORRECT_GUESS_REVEAL &&
                gameState.selectedBoxId === box.id;

              return (
                <div
                  key={box.id}
                  className={`lets-find-boxes-game__box-slot${
                    isIncorrectBox
                      ? ' lets-find-boxes-game__box-slot--incorrect'
                      : ''
                  }${
                    isCorrectBox
                      ? ' lets-find-boxes-game__box-slot--correct'
                      : ''
                  }`}
                  data-box-id={box.id}
                  data-box-position={box.position}
                  onAnimationEnd={(event) => {
                    if (event.target !== event.currentTarget) {
                      return;
                    }

                    if (
                      gameState.phase ===
                        BOXES_GAME_PHASES.BOXES_HIDING_OBJECT &&
                      box.position === gameState.boxCount - 1
                    ) {
                      gameState.completePhase(
                        BOXES_GAME_PHASES.BOXES_HIDING_OBJECT,
                      );
                    } else if (isIncorrectBox) {
                      gameState.completePhase(
                        BOXES_GAME_PHASES.INCORRECT_GUESS_FEEDBACK,
                      );
                    }
                  }}
                  style={{
                    '--box-entrance-index': box.position,
                    '--box-flip-delay': `${box.position * BOXES_HIDE_MS}ms`,
                    '--box-lower-delay': `${
                      box.position * BOXES_HIDE_MS + BOXES_FLIP_MS
                    }ms`,
                  }}
                >
                  <button
                    ref={(element) => {
                      if (element) {
                        boxButtonRefs.current[box.id] = element;
                      } else {
                        delete boxButtonRefs.current[box.id];
                      }
                    }}
                    className="lets-find-boxes-game__box-button"
                    aria-label={`${box.displayName} box`}
                    data-directional-navigation-item={
                      boxSelectionEnabled ? '' : undefined
                    }
                    disabled={!boxSelectionEnabled}
                    onClick={(event) => {
                      event.stopPropagation();

                      if (boxSelectionEnabled) {
                        lastFocusedBoxIdRef.current = box.id;
                        gameState.selectBox(box.id);
                      }
                    }}
                    onFocus={() => {
                      lastFocusedBoxIdRef.current = box.id;
                    }}
                    tabIndex={boxSelectionEnabled ? 0 : -1}
                    type="button"
                  >
                    <span className="lets-find-boxes-game__box-visual">
                      <img
                        className="lets-find-boxes-game__box-image"
                        alt=""
                        onAnimationEnd={(event) => {
                          if (
                            event.target === event.currentTarget &&
                            gameState.phase ===
                              BOXES_GAME_PHASES.BOXES_ENTERING &&
                            box.position === gameState.boxCount - 1
                          ) {
                            gameState.completePhase(
                              BOXES_GAME_PHASES.BOXES_ENTERING,
                            );
                          }
                        }}
                        src={box.image}
                      />
                    </span>
                  </button>

                  {isIncorrectBox && (
                    <span
                      className="lets-find-boxes-game__incorrect-feedback"
                      aria-hidden="true"
                    >
                      <FontAwesomeIcon icon={faThumbsDown} />
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <div
          className={`lets-find-boxes-game__object-region lets-find-boxes-game__object-region--${objectPhase}`}
          aria-hidden="true"
        >
          <img
            className="lets-find-boxes-game__object-image"
            alt=""
            onAnimationEnd={handleObjectAnimationEnd}
            src={gameState.object.image}
          />
        </div>

        <div
          className={`lets-find-boxes-game__start-region lets-find-boxes-game__start-region--${startPhase}`}
          aria-hidden={startPhase === 'hidden'}
        >
          {startPhase !== 'hidden' && (
            <Button
              className="lets-find-boxes-game__start-button"
              disabled={!gameState.inputPermitted}
              onClick={(event) => {
                event.stopPropagation();
                requestAdvance();
              }}
              onAnimationEnd={handleStartAnimationEnd}
              size="large"
            >
              Start
            </Button>
          )}
        </div>

        <div
          className={`lets-find-boxes-game__instruction-region${
            instructionVisible
              ? ' lets-find-boxes-game__instruction-region--visible'
              : ''
          }`}
          aria-hidden={!instructionVisible}
        >
          Find the {gameState.object.displayName}!
        </div>

        <div
          className="lets-find-boxes-game__feedback-region"
          aria-hidden="true"
        />

        <section
          className={`lets-find-boxes-game__success-region lets-find-boxes-game__success-region--${successPhase}`}
          aria-hidden={successPhase === 'hidden'}
          aria-live="polite"
        >
          <div
            className="lets-find-boxes-game__success-message"
            onAnimationEnd={(event) => {
              if (
                event.target === event.currentTarget &&
                gameState.phase === BOXES_GAME_PHASES.SUCCESS_ANIMATION
              ) {
                gameState.completePhase(BOXES_GAME_PHASES.SUCCESS_ANIMATION);
              }
            }}
          >
            {successText}
          </div>
        </section>

        <div
          ref={completionRegionRef}
          className={`lets-find-boxes-game__completion-region${
            completionVisible
              ? ' lets-find-boxes-game__completion-region--visible'
              : ''
          }`}
          aria-hidden={!completionVisible}
          aria-label="Completion actions"
          onKeyDown={handleCompletionNavigation}
          role="group"
        >
          <Button
            className="lets-find-boxes-game__completion-button"
            data-directional-navigation-item={
              completionInputPermitted ? '' : undefined
            }
            disabled={!completionInputPermitted}
            onClick={(event) => {
              event.stopPropagation();
              onPlayAgain();
            }}
            tabIndex={completionInputPermitted ? undefined : -1}
          >
            Play Again
          </Button>
          <Button
            className="lets-find-boxes-game__completion-button"
            data-directional-navigation-item={
              completionInputPermitted ? '' : undefined
            }
            disabled={!completionInputPermitted}
            onClick={(event) => {
              event.stopPropagation();
              onBackToLetsFind();
            }}
            tabIndex={completionInputPermitted ? undefined : -1}
            variant="secondary"
          >
            Back to Let's Find
          </Button>
          <Button
            className="lets-find-boxes-game__completion-button"
            data-directional-navigation-item={
              completionInputPermitted ? '' : undefined
            }
            disabled={!completionInputPermitted}
            onClick={(event) => {
              event.stopPropagation();
              onBackToHome();
            }}
            tabIndex={completionInputPermitted ? undefined : -1}
            variant="secondary"
          >
            Back to Home
          </Button>
        </div>
      </div>

      <p className="lets-find-boxes-game__assistive" id={instructionsId}>
        When prompted, click or tap the activity, or press Enter or Space, to
        continue.
      </p>
    </main>
  );
}

export default BoxesGameScene;
