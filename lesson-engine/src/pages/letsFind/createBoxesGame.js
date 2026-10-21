import { BOX_OPTIONS } from './boxAssets';
import { getFindObjectCategory } from './findObjectCategories';

export const SUPPORTED_BOX_COUNTS = Object.freeze([2, 3, 4]);

let roundSequence = 0;

function randomIndex(length, random) {
  return Math.floor(random() * length);
}

function shuffledCopy(items, random) {
  const shuffledItems = [...items];

  for (let index = shuffledItems.length - 1; index > 0; index -= 1) {
    const swapIndex = randomIndex(index + 1, random);
    [shuffledItems[index], shuffledItems[swapIndex]] = [
      shuffledItems[swapIndex],
      shuffledItems[index],
    ];
  }

  return shuffledItems;
}

function createRoundId(random) {
  roundSequence += 1;

  const timestamp = Date.now().toString(36);
  const sequence = roundSequence.toString(36);
  const randomPart = Math.floor(random() * 0x100000000).toString(36);

  return `boxes-round-${timestamp}-${sequence}-${randomPart}`;
}

function createObjectSelectionPool(category, previousObjectId, random) {
  const objectIds = shuffledCopy(category.items, random).map((item) => item.id);

  if (objectIds.length > 1 && objectIds[0] === previousObjectId) {
    const swapIndex = 1 + randomIndex(objectIds.length - 1, random);
    [objectIds[0], objectIds[swapIndex]] = [
      objectIds[swapIndex],
      objectIds[0],
    ];
  }

  const followsOriginalOrder = objectIds.every(
    (objectId, index) => objectId === category.items[index].id,
  );

  if (followsOriginalOrder && objectIds.length > 2) {
    const firstSwapIndex = 1 + randomIndex(objectIds.length - 1, random);
    let secondSwapIndex = 1 + randomIndex(objectIds.length - 2, random);

    if (secondSwapIndex >= firstSwapIndex) {
      secondSwapIndex += 1;
    }

    [objectIds[firstSwapIndex], objectIds[secondSwapIndex]] = [
      objectIds[secondSwapIndex],
      objectIds[firstSwapIndex],
    ];
  }

  return objectIds;
}

function canContinueObjectSelectionPool(category, previousGame) {
  const previousPool = previousGame?.objectSelectionPool;
  const remainingObjectIds = previousPool?.remainingObjectIds;
  const categoryObjectIds = new Set(category.items.map((item) => item.id));

  return (
    previousGame?.settings?.objectCategory === category.id &&
    previousPool?.categoryId === category.id &&
    Array.isArray(remainingObjectIds) &&
    remainingObjectIds.length > 0 &&
    remainingObjectIds.length < category.items.length &&
    new Set(remainingObjectIds).size === remainingObjectIds.length &&
    !remainingObjectIds.includes(previousGame.object?.id) &&
    remainingObjectIds.every((objectId) => categoryObjectIds.has(objectId))
  );
}

function selectObject(category, previousGame, random) {
  const remainingObjectIds = canContinueObjectSelectionPool(
    category,
    previousGame,
  )
    ? [...previousGame.objectSelectionPool.remainingObjectIds]
    : createObjectSelectionPool(category, previousGame?.object?.id, random);
  const selectedObjectId = remainingObjectIds.shift();
  const selectedItem = category.items.find(
    (item) => item.id === selectedObjectId,
  );

  return {
    object: {
      id: selectedItem.id,
      displayName: selectedItem.word,
      image: selectedItem.image,
      categoryId: selectedItem.categoryId,
    },
    objectSelectionPool: {
      categoryId: category.id,
      remainingObjectIds,
    },
  };
}

function hasSameBoxOrder(boxOptions, previousGame) {
  const previousBoxes = previousGame?.boxes;

  return (
    previousBoxes?.length === boxOptions.length &&
    boxOptions.every((box, index) => box.color === previousBoxes[index].color)
  );
}

function getPreviousCorrectBoxColor(previousGame) {
  const storedColor = previousGame?.correctBoxColor;

  if (BOX_OPTIONS.some((box) => box.color === storedColor)) {
    return storedColor;
  }

  const previousCorrectBox = previousGame?.boxes?.find(
    (box) => box.id === previousGame.correctBoxId,
  );

  return BOX_OPTIONS.some((box) => box.color === previousCorrectBox?.color)
    ? previousCorrectBox.color
    : null;
}

function preventRepeatedBoxOrder(
  selectedBoxes,
  correctBoxPosition,
  previousGame,
  random,
) {
  if (!hasSameBoxOrder(selectedBoxes, previousGame)) {
    return;
  }

  const incorrectPositions = selectedBoxes
    .map((_, position) => position)
    .filter((position) => position !== correctBoxPosition);

  if (incorrectPositions.length > 1) {
    const [firstPosition, secondPosition] = incorrectPositions;
    [selectedBoxes[firstPosition], selectedBoxes[secondPosition]] = [
      selectedBoxes[secondPosition],
      selectedBoxes[firstPosition],
    ];
    return;
  }

  const selectedColors = new Set(selectedBoxes.map((box) => box.color));
  const replacementOptions = BOX_OPTIONS.filter(
    (box) => !selectedColors.has(box.color),
  );
  selectedBoxes[incorrectPositions[0]] =
    replacementOptions[randomIndex(replacementOptions.length, random)];
}

function selectBoxOptions(
  boxCount,
  correctBoxPosition,
  previousCorrectBoxColor,
  previousGame,
  random,
) {
  const eligibleCorrectBoxes = BOX_OPTIONS.filter(
    (box) => box.color !== previousCorrectBoxColor,
  );
  const correctBox =
    eligibleCorrectBoxes[randomIndex(eligibleCorrectBoxes.length, random)];
  const remainingBoxes = shuffledCopy(
    BOX_OPTIONS.filter((box) => box.color !== correctBox.color),
    random,
  ).slice(0, boxCount - 1);
  const selectedBoxes = Array(boxCount);
  let remainingBoxIndex = 0;

  for (let position = 0; position < boxCount; position += 1) {
    if (position === correctBoxPosition) {
      selectedBoxes[position] = correctBox;
    } else {
      selectedBoxes[position] = remainingBoxes[remainingBoxIndex];
      remainingBoxIndex += 1;
    }
  }

  preventRepeatedBoxOrder(
    selectedBoxes,
    correctBoxPosition,
    previousGame,
    random,
  );

  return selectedBoxes;
}

function getPreviousCorrectBoxPosition(boxCount, previousGame) {
  if (previousGame?.settings?.boxCount !== boxCount) {
    return null;
  }

  if (
    Number.isInteger(previousGame.correctBoxPosition) &&
    previousGame.correctBoxPosition >= 0 &&
    previousGame.correctBoxPosition < boxCount
  ) {
    return previousGame.correctBoxPosition;
  }

  return (
    previousGame.boxes?.find((box) => box.id === previousGame.correctBoxId)
      ?.position ?? null
  );
}

function selectCorrectBoxPosition(
  boxCount,
  previousCorrectBoxPosition,
  random,
) {
  const eligiblePositions = Array.from(
    { length: boxCount },
    (_, position) => position,
  ).filter((position) => position !== previousCorrectBoxPosition);

  return eligiblePositions[randomIndex(eligiblePositions.length, random)];
}

function createObjectEntrancePosition(previousGame, random) {
  const position = {
    leftPercent: 15 + randomIndex(71, random),
    topVh: 115 + randomIndex(21, random),
  };
  const previousPosition = previousGame?.objectEntrancePosition;

  if (
    previousPosition?.leftPercent === position.leftPercent &&
    previousPosition.topVh === position.topVh
  ) {
    position.leftPercent = position.leftPercent === 85 ? 84 : position.leftPercent + 1;
  }

  return position;
}

export function createBoxesGame(settings, previousGame = null, random = Math.random) {
  const { boxCount, objectCategory } = settings;
  const category = getFindObjectCategory(objectCategory);

  if (!category) {
    throw new Error(`Unsupported object category: ${objectCategory}`);
  }

  if (!SUPPORTED_BOX_COUNTS.includes(boxCount)) {
    throw new Error(`Unsupported box count: ${boxCount}`);
  }

  const roundId = createRoundId(random);
  const { object, objectSelectionPool } = selectObject(
    category,
    previousGame,
    random,
  );
  const previousCorrectBoxPosition = getPreviousCorrectBoxPosition(
    boxCount,
    previousGame,
  );
  const correctBoxPosition = selectCorrectBoxPosition(
    boxCount,
    previousCorrectBoxPosition,
    random,
  );
  const previousCorrectBoxColor = getPreviousCorrectBoxColor(previousGame);
  const selectedBoxes = selectBoxOptions(
    boxCount,
    correctBoxPosition,
    previousCorrectBoxColor,
    previousGame,
    random,
  );
  const correctBoxColor = selectedBoxes[correctBoxPosition].color;
  const boxes = selectedBoxes.map((box, position) => {
    const id = `${roundId}-box-${position + 1}`;

    return {
      id,
      color: box.color,
      displayName: box.displayName,
      image: box.image,
      position,
      containsObject: position === correctBoxPosition,
    };
  });

  return {
    roundId,
    settings: {
      boxCount,
      objectCategory,
    },
    object,
    objectSelectionPool,
    boxes,
    correctBoxId: boxes[correctBoxPosition].id,
    correctBoxColor,
    correctBoxPosition,
    objectEntrancePosition: createObjectEntrancePosition(previousGame, random),
  };
}

export default createBoxesGame;
