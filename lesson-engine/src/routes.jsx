import { Navigate, Route, Routes } from 'react-router-dom';
import About from './pages/about';
import Home from './pages/home';
import LetsCountActivity from './pages/letsCount/letsCountActivity';
import LetsFindBoxesPlayback from './pages/letsFind/letsFindBoxesPlayback';
import LetsFindSetup from './pages/letsFind/letsFindSetup';
import LetsSpellActivity from './pages/letsSpell/letsSpellActivity';
import LetsSpellCategory from './pages/letsSpell/letsSpellCategory';
import LetsSpellPlayback from './pages/letsSpell/letsSpellPlayback';
import LetsSpellSetup from './pages/letsSpell/letsSpellSetup';
import TeachersPage from './pages/teachers/teachersPage';

function AppRoutes({ location }) {
  return (
    <Routes location={location}>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/letsSpell" element={<LetsSpellActivity />} />
      <Route path="/letsSpell/setup" element={<LetsSpellSetup />} />
      <Route path="/letsSpell/:categoryId/play" element={<LetsSpellPlayback />} />
      <Route path="/letsSpell/:categoryId" element={<LetsSpellCategory />} />
      <Route path="/letsCount" element={<LetsCountActivity />} />
      <Route path="/letsFind" element={<LetsFindSetup />} />
      <Route
        path="/letsFind/boxes"
        element={<Navigate replace to="/letsFind" />}
      />
      <Route path="/letsFind/boxes/play" element={<LetsFindBoxesPlayback />} />
      <Route
        path="/letsFind/setup"
        element={<Navigate replace to="/letsFind" />}
      />
      <Route path="/teachers" element={<TeachersPage />} />
    </Routes>
  );
}

export default AppRoutes;
