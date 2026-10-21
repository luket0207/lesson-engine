import Button from '../../components/button/button';
import NavigationPod from '../../components/navigationPod/navigationPod';
import useDirectionalNavigation from '../../hooks/useDirectionalNavigation';
import './letsFindActivity.scss';

function LetsFindActivity() {
  const handleDirectionalNavigation = useDirectionalNavigation();

  return (
    <main className="lets-find-page" onKeyDown={handleDirectionalNavigation}>
      <h1 className="lets-find-page__title">Let's Find</h1>

      <nav className="lets-find-page__grid" aria-label="Finding modes">
        <NavigationPod disabled size="tall">
          <span className="lets-find-page__unavailable-mode">
            <span>Houses</span>
            <span className="lets-find-page__availability">Coming soon</span>
          </span>
        </NavigationPod>
        <NavigationPod label="Boxes" size="tall" to="/letsFind/boxes" />
      </nav>

      <div className="lets-find-page__back">
        <Button data-directional-navigation-item="" to="/" variant="secondary">
          Back to Home
        </Button>
      </div>
    </main>
  );
}

export default LetsFindActivity;
