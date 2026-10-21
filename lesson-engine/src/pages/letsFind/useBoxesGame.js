import { useCallback, useReducer } from 'react';
import {
  BOXES_GAME_ACTIONS,
  boxesGameReducer,
  createBoxesGameState,
} from './boxesGameState';

function useBoxesGame(game) {
  const [state, dispatch] = useReducer(boxesGameReducer, game, createBoxesGameState);

  const dispatchForCurrentRound = useCallback(
    (action) => dispatch({ ...action, roundId: state.roundId }),
    [state.roundId],
  );

  const completePhase = useCallback(
    (phase) => {
      dispatchForCurrentRound({
        type: BOXES_GAME_ACTIONS.COMPLETE_PHASE,
        phase,
      });
    },
    [dispatchForCurrentRound],
  );

  const beginBoxEntrance = useCallback(() => {
    dispatchForCurrentRound({ type: BOXES_GAME_ACTIONS.BEGIN_BOX_ENTRANCE });
  }, [dispatchForCurrentRound]);

  const beginObjectEntrance = useCallback(() => {
    dispatchForCurrentRound({ type: BOXES_GAME_ACTIONS.BEGIN_OBJECT_ENTRANCE });
  }, [dispatchForCurrentRound]);

  const selectBox = useCallback(
    (boxId) => {
      dispatchForCurrentRound({
        type: BOXES_GAME_ACTIONS.SELECT_BOX,
        boxId,
      });
    },
    [dispatchForCurrentRound],
  );

  return {
    ...state,
    beginBoxEntrance,
    beginObjectEntrance,
    completePhase,
    selectBox,
  };
}

export default useBoxesGame;
