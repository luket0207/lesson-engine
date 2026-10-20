import {
  faArrowDown19,
  faArrowDownAZ,
  faMagnifyingGlass,
} from '@fortawesome/free-solid-svg-icons';
import NavigationPod from '../components/navigationPod/navigationPod';
import useDirectionalNavigation from '../hooks/useDirectionalNavigation';
import './home.scss';

function Home() {
  const handleDirectionalNavigation = useDirectionalNavigation();

  return (
    <main className="home-page" onKeyDown={handleDirectionalNavigation}>
      <h1 className="home-page__title">Home</h1>

      <section className="home-page__section" aria-labelledby="activities-heading">
        <h2 className="home-page__section-title" id="activities-heading">
          Activities
        </h2>
        <div className="home-page__grid">
          <NavigationPod
            icon={faArrowDownAZ}
            label="Let's Spell"
            size="tall"
            to="/letsSpell"
          />
          <NavigationPod
            icon={faArrowDown19}
            label="Let's Count"
            size="tall"
            to="/letsCount"
          />
          <NavigationPod
            icon={faMagnifyingGlass}
            label="Let's Find"
            size="tall"
            to="/letsFind"
          />
        </div>
      </section>

    </main>
  );
}

export default Home;
