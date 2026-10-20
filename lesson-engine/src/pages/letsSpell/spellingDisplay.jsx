function getImageStage(sequence) {
  const revealTransition =
    sequence.isAnimationRunning && sequence.transitionKind === 'reveal';

  if (
    revealTransition &&
    sequence.transitionDirection === 'forward' &&
    sequence.revealStage === 1
  ) {
    return 'entering';
  }

  if (
    revealTransition &&
    sequence.transitionDirection === 'backward' &&
    sequence.revealStage === 0
  ) {
    return 'exiting';
  }

  return sequence.imageVisible ? 'visible' : 'hidden';
}

function getLetterStage(sequence, letterIndex) {
  const revealTransition =
    sequence.isAnimationRunning && sequence.transitionKind === 'reveal';

  if (
    revealTransition &&
    sequence.transitionDirection === 'forward' &&
    sequence.revealStage >= 2 &&
    letterIndex === sequence.visibleLetterCount - 1
  ) {
    return 'entering';
  }

  if (
    revealTransition &&
    sequence.transitionDirection === 'backward' &&
    sequence.revealStage >= 1 &&
    letterIndex === sequence.visibleLetterCount
  ) {
    return 'exiting';
  }

  return letterIndex < sequence.visibleLetterCount ? 'visible' : 'hidden';
}

function SpellingDisplay({ completionActions, sequence }) {
  const imageStage = getImageStage(sequence);

  const handleImageAnimationEnd = (event) => {
    if (
      event.target === event.currentTarget &&
      (imageStage === 'entering' || imageStage === 'exiting')
    ) {
      sequence.completeAnimation();
    }
  };

  return (
    <>
      <div className="lets-spell-playback__image-region" aria-hidden="true">
        <img
          key={sequence.currentItem.id}
          className={`lets-spell-playback__image lets-spell-playback__image--${imageStage}`}
          alt=""
          onAnimationEnd={handleImageAnimationEnd}
          src={sequence.currentItem.image}
        />
      </div>

      <div className="lets-spell-playback__word-region" aria-hidden="true">
        <div className="lets-spell-playback__word">
          {sequence.currentCharacters.map((spellingCharacter) => {
            if (spellingCharacter.isSpace) {
              return (
                <span
                  key={spellingCharacter.characterIndex}
                  className="lets-spell-playback__letter lets-spell-playback__letter--space"
                >
                  {'\u00a0'}
                </span>
              );
            }

            const letterStage = getLetterStage(
              sequence,
              spellingCharacter.letterIndex,
            );

            return (
              <span
                key={spellingCharacter.characterIndex}
                className={`lets-spell-playback__letter lets-spell-playback__letter--${letterStage}`}
                onAnimationEnd={(event) => {
                  if (
                    event.target === event.currentTarget &&
                    (letterStage === 'entering' || letterStage === 'exiting')
                  ) {
                    sequence.completeAnimation();
                  }
                }}
              >
                {spellingCharacter.character}
              </span>
            );
          })}
        </div>
      </div>

      <div className="lets-spell-playback__completion-region">
        {completionActions}
      </div>
    </>
  );
}

export default SpellingDisplay;
