import { useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../../components/button/button';
import useDirectionalNavigation from '../../hooks/useDirectionalNavigation';
import createBoxesGame, { SUPPORTED_BOX_COUNTS } from './createBoxesGame';
import FIND_OBJECT_CATEGORIES from './findObjectCategories';
import './letsFindSetup.scss';

const DEFAULT_SETTINGS = {
  boxCount: 3,
  boxNames: true,
  objectCategory: 'animals',
};

function getInitialSettings(routeSettings) {
  return {
    boxCount: SUPPORTED_BOX_COUNTS.includes(routeSettings?.boxCount)
      ? routeSettings.boxCount
      : DEFAULT_SETTINGS.boxCount,
    boxNames:
      typeof routeSettings?.boxNames === 'boolean'
        ? routeSettings.boxNames
        : DEFAULT_SETTINGS.boxNames,
    objectCategory: FIND_OBJECT_CATEGORIES.some(
      (category) => category.id === routeSettings?.objectCategory,
    )
      ? routeSettings.objectCategory
      : DEFAULT_SETTINGS.objectCategory,
  };
}

function LetsFindSetup() {
  const location = useLocation();
  const navigate = useNavigate();
  const handleDirectionalNavigation = useDirectionalNavigation();
  const [isStarting, setIsStarting] = useState(false);
  const [settings, setSettings] = useState(() =>
    getInitialSettings(location.state?.settings),
  );
  const startRequestedRef = useRef(false);

  const updateSetting = (name, value) => {
    setSettings((currentSettings) => ({
      ...currentSettings,
      [name]: value,
    }));
  };

  const handleStart = () => {
    if (startRequestedRef.current) {
      return;
    }

    startRequestedRef.current = true;
    setIsStarting(true);
    navigate('/letsFind/boxes/play', {
      state: { game: createBoxesGame(settings) },
    });
  };

  return (
    <main
      className="lets-find-boxes-options"
      aria-label="Boxes game options"
      onKeyDown={handleDirectionalNavigation}
    >
      <div className="lets-find-boxes-options__start">
        <Button
          data-directional-navigation-item=""
          disabled={isStarting}
          onClick={handleStart}
          size="large"
        >
          Start
        </Button>
      </div>

      <section
        className="lets-find-boxes-options__panel"
        aria-label="Game settings"
      >
        <div
          className="lets-find-boxes-options__group"
          aria-labelledby="box-amount-label"
          role="radiogroup"
        >
          <p className="lets-find-boxes-options__label" id="box-amount-label">
            Amount of Boxes
          </p>
          <div className="lets-find-boxes-options__choices">
            {SUPPORTED_BOX_COUNTS.map((amount) => {
              const selected = settings.boxCount === amount;

              return (
                <Button
                  key={amount}
                  aria-checked={selected}
                  aria-label={`${amount} boxes`}
                  className={selected ? 'app-button--selected' : ''}
                  data-directional-navigation-item=""
                  onClick={() => updateSetting('boxCount', amount)}
                  role="radio"
                  variant="tertiary"
                >
                  {amount}
                </Button>
              );
            })}
          </div>
        </div>

        <div
          className="lets-find-boxes-options__group"
          aria-labelledby="object-category-label"
          role="radiogroup"
        >
          <p
            className="lets-find-boxes-options__label"
            id="object-category-label"
          >
            Objects
          </p>
          <div className="lets-find-boxes-options__choices">
            {FIND_OBJECT_CATEGORIES.map((category) => {
              const selected = settings.objectCategory === category.id;

              return (
                <Button
                  key={category.id}
                  aria-checked={selected}
                  className={selected ? 'app-button--selected' : ''}
                  data-directional-navigation-item=""
                  onClick={() => updateSetting('objectCategory', category.id)}
                  role="radio"
                  variant="tertiary"
                >
                  {category.displayName}
                </Button>
              );
            })}
          </div>
        </div>

        <div className="lets-find-boxes-options__group">
          <label
            className="lets-find-boxes-options__checkbox"
            htmlFor="box-names"
          >
            <input
              checked={settings.boxNames}
              data-directional-navigation-item=""
              id="box-names"
              onChange={(event) =>
                updateSetting('boxNames', event.target.checked)
              }
              type="checkbox"
            />
            Box Names
          </label>
        </div>
      </section>

      <div className="lets-find-boxes-options__start">
        <Button
          data-directional-navigation-item=""
          disabled={isStarting}
          onClick={handleStart}
          size="large"
        >
          Start
        </Button>
      </div>

      <div className="lets-find-boxes-options__back">
        <Button data-directional-navigation-item="" to="/" variant="secondary">
          Back to Home
        </Button>
      </div>
    </main>
  );
}

export default LetsFindSetup;
