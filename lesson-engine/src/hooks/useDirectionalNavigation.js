import { useCallback } from 'react';

const DEFAULT_ITEM_SELECTOR = '[data-directional-navigation-item]';
const SUPPORTED_KEYS = new Set([
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowUp',
]);

function isInDirection(direction, currentRect, candidateRect) {
  const tolerance = 2;

  switch (direction) {
    case 'ArrowLeft':
      return candidateRect.right <= currentRect.left + tolerance;
    case 'ArrowRight':
      return candidateRect.left >= currentRect.right - tolerance;
    case 'ArrowUp':
      return candidateRect.bottom <= currentRect.top + tolerance;
    case 'ArrowDown':
      return candidateRect.top >= currentRect.bottom - tolerance;
    default:
      return false;
  }
}

function getDistanceScore(direction, currentRect, candidateRect) {
  const currentCenter = {
    x: currentRect.left + currentRect.width / 2,
    y: currentRect.top + currentRect.height / 2,
  };
  const candidateCenter = {
    x: candidateRect.left + candidateRect.width / 2,
    y: candidateRect.top + candidateRect.height / 2,
  };
  const horizontalDistance = Math.abs(candidateCenter.x - currentCenter.x);
  const verticalDistance = Math.abs(candidateCenter.y - currentCenter.y);
  const isHorizontal = direction === 'ArrowLeft' || direction === 'ArrowRight';
  const primaryDistance = isHorizontal ? horizontalDistance : verticalDistance;
  const crossAxisDistance = isHorizontal ? verticalDistance : horizontalDistance;

  return primaryDistance + crossAxisDistance * 2;
}

function useDirectionalNavigation(itemSelector = DEFAULT_ITEM_SELECTOR) {
  return useCallback(
    (event) => {
      if (
        !SUPPORTED_KEYS.has(event.key) ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey
      ) {
        return;
      }

      const container = event.currentTarget;
      const currentItem = event.target.closest?.(itemSelector);

      if (!currentItem || !container.contains(currentItem)) {
        return;
      }

      event.preventDefault();

      const currentRect = currentItem.getBoundingClientRect();
      const candidates = Array.from(container.querySelectorAll(itemSelector)).filter(
        (item) => item !== currentItem && item.getClientRects().length > 0,
      );

      let closestItem = null;
      let closestScore = Number.POSITIVE_INFINITY;

      candidates.forEach((candidate) => {
        const candidateRect = candidate.getBoundingClientRect();

        if (!isInDirection(event.key, currentRect, candidateRect)) {
          return;
        }

        const score = getDistanceScore(event.key, currentRect, candidateRect);

        if (score < closestScore) {
          closestItem = candidate;
          closestScore = score;
        }
      });

      closestItem?.focus();
    },
    [itemSelector],
  );
}

export default useDirectionalNavigation;
