import Button from '../../components/button/button';
import NavigationPod from '../../components/navigationPod/navigationPod';
import useDirectionalNavigation from '../../hooks/useDirectionalNavigation';
import SPELLING_CATEGORIES from './spellingCategories';
import './letsSpellActivity.scss';

function LetsSpellActivity() {
  const handleDirectionalNavigation = useDirectionalNavigation();

  return (
    <main className="lets-spell-page" onKeyDown={handleDirectionalNavigation}>
      <h1 className="lets-spell-page__title">Let's Spell</h1>

      <nav className="lets-spell-page__grid" aria-label="Spelling categories">
        {SPELLING_CATEGORIES.map((category) => (
          <NavigationPod
            key={category.id}
            label={category.displayName}
            size="tall"
            to={`/letsSpell/${category.id}`}
          />
        ))}
      </nav>

      <div className="lets-spell-page__back">
        <Button data-directional-navigation-item="" to="/" variant="secondary">
          Back to Home
        </Button>
      </div>
    </main>
  );
}

export default LetsSpellActivity;
