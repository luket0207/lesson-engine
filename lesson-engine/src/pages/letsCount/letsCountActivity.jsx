import { useCallback, useEffect, useState } from 'react';
import { useAppShell } from '../../components/appShell/appShell';
import Button from '../../components/button/button';
import CountingMessage from './countingMessage';
import CountingNumber from './countingNumber';
import {
  AUTO_COUNT_DELAYS_MS,
  COMPLETION_ACTIONS_FADE_MS,
  COUNTING_ANIMATION_MS,
  INTRODUCTION_HOLD_MS,
} from './countingTimings';
import useCountingSequence, { COUNTING_PHASES } from './useCountingSequence';
import './letsCountActivity.scss';

const INITIAL_CONFIGURATION = {
  autoCount: true,
  direction: 'up',
  limit: 10,
  speed: 'normal',
  words: true,
};

const NUMBER_LIMITS = [5, 10, 20];
const COUNTING_SPEEDS = ['slow', 'normal', 'fast'];
const INTRODUCTION_STAGES = {
  [COUNTING_PHASES.INTRODUCTION_ENTERING]: 'entering',
  [COUNTING_PHASES.INTRODUCTION_HOLDING]: 'holding',
  [COUNTING_PHASES.INTRODUCTION_EXITING]: 'exiting',
};
const FINISHED_STAGES = {
  [COUNTING_PHASES.FINISHED_ENTERING]: 'entering',
  [COUNTING_PHASES.FINISHED_DISPLAYED]: 'displayed',
};
const NUMBER_STAGES = {
  [COUNTING_PHASES.NUMBER_ENTERING]: 'entering',
  [COUNTING_PHASES.NUMBER_DISPLAYED]: 'displayed',
  [COUNTING_PHASES.NUMBER_EXITING]: 'exiting',
};
const SEQUENCE_STYLE = {
  '--counting-animation-duration': `${COUNTING_ANIMATION_MS}ms`,
  '--completion-actions-fade-duration': `${COMPLETION_ACTIONS_FADE_MS}ms`,
};

function LetsCountActivity() {
  const { isOptionsOpen } = useAppShell();
  const [configuration, setConfiguration] = useState(INITIAL_CONFIGURATION);
  const {
    completePhase,
    currentIndex,
    currentNumber,
    currentWord,
    phase,
    returnToOptions,
    requestNext,
    sequence,
    sequenceConfiguration,
    startSequence,
  } = useCountingSequence();
  const introductionStage = INTRODUCTION_STAGES[phase];
  const finishedStage = FINISHED_STAGES[phase];
  const numberStage = NUMBER_STAGES[phase];
  const manualAdvanceAvailable =
    !isOptionsOpen &&
    phase === COUNTING_PHASES.NUMBER_DISPLAYED &&
    sequenceConfiguration?.autoCount === false;
  const finalNumberDisplayed = currentIndex === sequence.length - 1;

  const handlePhaseComplete = useCallback(() => {
    completePhase(phase);
  }, [completePhase, phase]);

  useEffect(() => {
    if (
      isOptionsOpen ||
      phase !== COUNTING_PHASES.NUMBER_DISPLAYED ||
      !sequenceConfiguration?.autoCount
    ) {
      return undefined;
    }

    const displayTimer = window.setTimeout(
      requestNext,
      AUTO_COUNT_DELAYS_MS[sequenceConfiguration.speed],
    );

    return () => window.clearTimeout(displayTimer);
  }, [isOptionsOpen, phase, requestNext, sequenceConfiguration]);

  const updateConfiguration = (updates) => {
    setConfiguration((currentConfiguration) => ({
      ...currentConfiguration,
      ...updates,
    }));
  };

  const handleStartCounting = () => {
    startSequence(configuration);
  };

  if (phase !== COUNTING_PHASES.OPTIONS) {
    return (
      <main
        className={`lets-count-page lets-count-page--sequence${
          isOptionsOpen ? ' lets-count-page--paused' : ''
        }`}
        style={SEQUENCE_STYLE}
      >
        {introductionStage && (
          <CountingMessage
            holdDuration={INTRODUCTION_HOLD_MS}
            onStageComplete={handlePhaseComplete}
            paused={isOptionsOpen}
            stage={introductionStage}
            text="Let's Start!"
          />
        )}

        {numberStage && (
          <CountingNumber
            advanceLabel={
              finalNumberDisplayed ? 'Finish counting' : 'Show next number'
            }
            direction={sequenceConfiguration.direction}
            interactive={manualAdvanceAvailable}
            number={currentNumber}
            onAdvance={requestNext}
            onStageComplete={handlePhaseComplete}
            stage={numberStage}
            word={currentWord}
          />
        )}

        {finishedStage && (
          <CountingMessage
            onStageComplete={handlePhaseComplete}
              paused={isOptionsOpen}
            stage={finishedStage}
            text="Finished!"
          >
            {phase === COUNTING_PHASES.FINISHED_DISPLAYED && (
              <div className="lets-count-page__completion-actions">
                <Button onClick={returnToOptions} variant="secondary">
                  Back to Let's Count
                </Button>
                <Button to="/" variant="secondary">
                  Back to Home
                </Button>
              </div>
            )}
          </CountingMessage>
        )}
      </main>
    );
  }

  return (
    <main className="lets-count-page">
      <h1 className="lets-count-page__title">Let's Count</h1>

      <Button
        className="lets-count-page__start"
        onClick={handleStartCounting}
        size="large"
      >
        Start Counting
      </Button>

      <section className="lets-count-page__options" aria-labelledby="count-options-heading">
        <h2 className="lets-count-page__options-title" id="count-options-heading">
          Options
        </h2>

        <fieldset className="lets-count-page__setting">
          <legend>Count Direction</legend>
          <div className="lets-count-page__choices">
            <Button
              onClick={() => updateConfiguration({ direction: 'up' })}
              selected={configuration.direction === 'up'}
              variant="tertiary"
            >
              Count Up
            </Button>
            <Button
              onClick={() => updateConfiguration({ direction: 'down' })}
              selected={configuration.direction === 'down'}
              variant="tertiary"
            >
              Count Down
            </Button>
          </div>
        </fieldset>

        <fieldset className="lets-count-page__setting">
          <legend>{configuration.direction === 'up' ? 'End Number' : 'Start Number'}</legend>
          <div className="lets-count-page__choices">
            {NUMBER_LIMITS.map((limit) => (
              <Button
                key={limit}
                onClick={() => updateConfiguration({ limit })}
                selected={configuration.limit === limit}
                variant="tertiary"
              >
                {limit}
              </Button>
            ))}
          </div>
        </fieldset>

        <div className="lets-count-page__setting">
          <label className="lets-count-page__checkbox" htmlFor="auto-count">
            <input
              checked={configuration.autoCount}
              id="auto-count"
              onChange={(event) =>
                updateConfiguration({ autoCount: event.target.checked })
              }
              type="checkbox"
            />
            Auto Count
          </label>

          {configuration.autoCount && (
            <div
              className="lets-count-page__speed"
              aria-labelledby="count-speed-label"
              role="group"
            >
              <span id="count-speed-label">Speed</span>
              <div className="lets-count-page__choices">
                {COUNTING_SPEEDS.map((speed) => (
                  <Button
                    key={speed}
                    onClick={() => updateConfiguration({ speed })}
                    selected={configuration.speed === speed}
                    variant="tertiary"
                  >
                    {speed.charAt(0).toUpperCase() + speed.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="lets-count-page__setting">
          <label className="lets-count-page__checkbox" htmlFor="show-words">
            <input
              checked={configuration.words}
              id="show-words"
              onChange={(event) => updateConfiguration({ words: event.target.checked })}
              type="checkbox"
            />
            Words
          </label>
        </div>
      </section>

      <Button className="lets-count-page__back" to="/" variant="secondary">
        Back to Home
      </Button>
    </main>
  );
}

export default LetsCountActivity;
