export const NUMBER_WORDS = Object.freeze({
  1: 'One',
  2: 'Two',
  3: 'Three',
  4: 'Four',
  5: 'Five',
  6: 'Six',
  7: 'Seven',
  8: 'Eight',
  9: 'Nine',
  10: 'Ten',
  11: 'Eleven',
  12: 'Twelve',
  13: 'Thirteen',
  14: 'Fourteen',
  15: 'Fifteen',
  16: 'Sixteen',
  17: 'Seventeen',
  18: 'Eighteen',
  19: 'Nineteen',
  20: 'Twenty',
});

const SUPPORTED_DIRECTIONS = ['up', 'down'];
const SUPPORTED_LIMITS = [5, 10, 20];

export function generateCountingSequence({ direction, limit }) {
  if (!SUPPORTED_DIRECTIONS.includes(direction)) {
    throw new Error(`Unsupported counting direction: ${direction}`);
  }

  if (!SUPPORTED_LIMITS.includes(limit)) {
    throw new Error(`Unsupported counting limit: ${limit}`);
  }

  return Array.from(
    { length: limit },
    (_, index) => (direction === 'up' ? index + 1 : limit - index),
  );
}

export function getNumberWord(number) {
  return NUMBER_WORDS[number] ?? null;
}
