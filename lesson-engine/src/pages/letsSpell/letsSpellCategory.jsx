import { useRef, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import Button from '../../components/button/button';
import NavigationPod from '../../components/navigationPod/navigationPod';
import useDirectionalNavigation from '../../hooks/useDirectionalNavigation';
import {
  createPlaybackSequence,
  PLAYBACK_MODES,
} from './createPlaybackSequence';
import SPELLING_CATEGORIES from './spellingCategories';
import './letsSpellCategory.scss';

const SELECTION_MODES = [
  { id: PLAYBACK_MODES.ALL, label: 'All' },
  { id: PLAYBACK_MODES.RANDOM_THREE, label: '3 Random' },
  { id: PLAYBACK_MODES.RANDOM_FIVE, label: '5 Random' },
];

function LetsSpellCategory() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const handleDirectionalNavigation = useDirectionalNavigation();
  const [isStarting, setIsStarting] = useState(false);
  const [selectionMode, setSelectionMode] = useState(PLAYBACK_MODES.RANDOM_THREE);
  const [shuffle, setShuffle] = useState(false);
  const startRequestedRef = useRef(false);
  const category = SPELLING_CATEGORIES.find(({ id }) => id === categoryId);

  if (!category) {
    return <Navigate replace to="/letsSpell" />;
  }

  const beginPlayback = (items, playbackMode) => {
    if (startRequestedRef.current) {
      return;
    }

    startRequestedRef.current = true;
    setIsStarting(true);
    navigate(`/letsSpell/${category.id}/play`, {
      state: {
        categoryId: category.id,
        items,
        playbackMode,
      },
    });
  };

  const handleSelectionModeChange = (mode) => {
    setSelectionMode(mode);
    setShuffle(mode === PLAYBACK_MODES.ALL);
  };

  const handleStart = () => {
    beginPlayback(
      createPlaybackSequence(category.items, selectionMode, shuffle),
      selectionMode,
    );
  };

  const handleItemSelection = (item) => {
    beginPlayback([item], PLAYBACK_MODES.INDIVIDUAL);
  };

  const shuffleDisabled = selectionMode !== PLAYBACK_MODES.ALL;

  return (
    <main className="lets-spell-category" onKeyDown={handleDirectionalNavigation}>
      <h1 className="lets-spell-category__title">{category.displayName}</h1>

      <div className="lets-spell-category__start-row">
        <Button
          className="lets-spell-category__start"
          data-directional-navigation-item=""
          disabled={isStarting}
          onClick={handleStart}
          size="large"
        >
          Start
        </Button>
      </div>

      <section className="lets-spell-category__controls" aria-label="Playback options">
        <div
          className="lets-spell-category__modes"
          aria-label="Item selection mode"
          role="radiogroup"
        >
          {SELECTION_MODES.map((mode) => {
            const selected = selectionMode === mode.id;

            return (
              <Button
                key={mode.id}
                aria-checked={selected}
                className={selected ? 'app-button--selected' : ''}
                data-directional-navigation-item=""
                onClick={() => handleSelectionModeChange(mode.id)}
                role="radio"
                variant="secondary"
              >
                {mode.label}
              </Button>
            );
          })}
        </div>

        <label
          className={`lets-spell-category__shuffle${
            shuffleDisabled ? ' lets-spell-category__shuffle--disabled' : ''
          }`}
          htmlFor="spell-shuffle"
        >
          <input
            checked={shuffle}
            data-directional-navigation-item={shuffleDisabled ? undefined : ''}
            disabled={shuffleDisabled}
            id="spell-shuffle"
            onChange={(event) => setShuffle(event.target.checked)}
            type="checkbox"
          />
          Shuffle
        </label>
      </section>

      <section className="lets-spell-category__items" aria-label={`${category.displayName} items`}>
        {category.items.map((item) => (
          <NavigationPod
            key={item.id}
            aria-label={`Spell ${item.word}`}
            onClick={() => handleItemSelection(item)}
          >
            <img
              className="lets-spell-category__item-image"
              alt=""
              src={item.image}
            />
          </NavigationPod>
        ))}
      </section>

      <div className="lets-spell-category__start-row">
        <Button
          className="lets-spell-category__start"
          data-directional-navigation-item=""
          disabled={isStarting}
          onClick={handleStart}
          size="large"
        >
          Start
        </Button>
      </div>

      <div className="lets-spell-category__back">
        <Button
          data-directional-navigation-item=""
          to="/letsSpell"
          variant="secondary"
        >
          Back to Let's Spell
        </Button>
      </div>
    </main>
  );
}

export default LetsSpellCategory;
