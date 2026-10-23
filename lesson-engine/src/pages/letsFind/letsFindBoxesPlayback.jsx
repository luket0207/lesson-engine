import { useRef } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAppShell } from '../../components/appShell/appShell';
import { BOXES_BY_COLOR } from './boxAssets';
import BoxesGameScene from './boxesGameScene';
import { BOXES_GAME_PHASES } from './boxesGameState';
import createBoxesGame, { SUPPORTED_BOX_COUNTS } from './createBoxesGame';
import { getFindObjectCategory } from './findObjectCategories';
import useBoxesGame from './useBoxesGame';
import './letsFindBoxesPlayback.scss';

function isValidGame(game) {
  const category = getFindObjectCategory(game?.settings?.objectCategory);
  const boxCount = game?.settings?.boxCount;
  const categoryObject = category?.items.find((item) => item.id === game?.object?.id);
  const boxes = game?.boxes;

  if (
    typeof game?.roundId !== 'string' ||
    !game.roundId ||
    !categoryObject ||
    categoryObject.word !== game.object.displayName ||
    categoryObject.image !== game.object.image ||
    !SUPPORTED_BOX_COUNTS.includes(boxCount) ||
    typeof game.settings.boxNames !== 'boolean' ||
    !Array.isArray(boxes) ||
    boxes.length !== boxCount
  ) {
    return false;
  }

  const boxIds = new Set(boxes.map((box) => box?.id));
  const boxColors = new Set(boxes.map((box) => box?.color));
  const boxesAreValid = boxes.every(
    (box, position) =>
      typeof box?.id === 'string' &&
      box.position === position &&
      BOXES_BY_COLOR[box.color]?.image === box.image &&
      typeof box.containsObject === 'boolean',
  );
  const correctBoxes = boxes.filter((box) => box.containsObject);
  const entrancePosition = game.objectEntrancePosition;
  const objectSelectionPool = game.objectSelectionPool;
  const remainingObjectIds = objectSelectionPool?.remainingObjectIds;
  const categoryObjectIds = new Set(category.items.map((item) => item.id));
  const objectSelectionPoolIsValid =
    objectSelectionPool?.categoryId === category.id &&
    Array.isArray(remainingObjectIds) &&
    remainingObjectIds.length < category.items.length &&
    new Set(remainingObjectIds).size === remainingObjectIds.length &&
    !remainingObjectIds.includes(game.object.id) &&
    remainingObjectIds.every((objectId) => categoryObjectIds.has(objectId));

  return (
    boxesAreValid &&
    boxIds.size === boxes.length &&
    boxColors.size === boxes.length &&
    correctBoxes.length === 1 &&
    correctBoxes[0].id === game.correctBoxId &&
    correctBoxes[0].color === game.correctBoxColor &&
    correctBoxes[0].position === game.correctBoxPosition &&
    objectSelectionPoolIsValid &&
    Number.isFinite(entrancePosition?.leftPercent) &&
    entrancePosition.leftPercent >= 0 &&
    entrancePosition.leftPercent <= 100 &&
    Number.isFinite(entrancePosition?.topVh) &&
    entrancePosition.topVh > 100
  );
}

function BoxesGameSession({ game }) {
  const { isOptionsOpen } = useAppShell();
  const navigate = useNavigate();
  const completionActionRunningRef = useRef(false);
  const gameState = useBoxesGame(game);
  const completionInputPermitted =
    gameState.phase === BOXES_GAME_PHASES.COMPLETED &&
    gameState.inputPermitted &&
    !isOptionsOpen;

  const runCompletionAction = (action) => {
    if (!completionInputPermitted || completionActionRunningRef.current) {
      return;
    }

    completionActionRunningRef.current = true;
    action();
  };

  return (
    <BoxesGameScene
      gameState={{
        ...gameState,
        inputPermitted: gameState.inputPermitted && !isOptionsOpen,
      }}
      onBackToHome={() => {
        runCompletionAction(() => navigate('/'));
      }}
      onBackToLetsFind={() => {
        runCompletionAction(() =>
          navigate('/letsFind', {
            state: { settings: game.settings },
          }),
        );
      }}
      onPlayAgain={() => {
        runCompletionAction(() => {
          const nextGame = createBoxesGame(game.settings, game);

          navigate('/letsFind/boxes/play', {
            replace: true,
            state: { game: nextGame },
          });
        });
      }}
    />
  );
}

function LetsFindBoxesPlayback() {
  const location = useLocation();
  const game = location.state?.game;

  if (!isValidGame(game)) {
    return <Navigate replace to="/letsFind" />;
  }

  return <BoxesGameSession key={game.roundId} game={game} />;
}

export default LetsFindBoxesPlayback;
