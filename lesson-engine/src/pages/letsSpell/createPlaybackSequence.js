export const PLAYBACK_MODES = {
  ALL: 'all',
  RANDOM_THREE: 'random-3',
  RANDOM_FIVE: 'random-5',
  INDIVIDUAL: 'individual',
};

const RANDOM_MODE_COUNTS = {
  [PLAYBACK_MODES.RANDOM_THREE]: 3,
  [PLAYBACK_MODES.RANDOM_FIVE]: 5,
};

function shuffledCopy(items) {
  const shuffledItems = [...items];

  for (let index = shuffledItems.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffledItems[index], shuffledItems[randomIndex]] = [
      shuffledItems[randomIndex],
      shuffledItems[index],
    ];
  }

  return shuffledItems;
}

export function createPlaybackSequence(items, mode, shuffleAll) {
  if (mode === PLAYBACK_MODES.ALL) {
    return shuffleAll ? shuffledCopy(items) : [...items];
  }

  return shuffledCopy(items).slice(0, RANDOM_MODE_COUNTS[mode]);
}
