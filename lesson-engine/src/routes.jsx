import { Route, Routes } from 'react-router-dom';
import About from './pages/about';
import Home from './pages/home';
import LetsCountActivity from './pages/letsCount/letsCountActivity';
import LetsFindActivity from './pages/letsFind/letsFindActivity';
import LetsFindSetup from './pages/letsFind/letsFindSetup';
import LetsSpellActivity from './pages/letsSpell/letsSpellActivity';
import LetsSpellSetup from './pages/letsSpell/letsSpellSetup';
import TeachersPage from './pages/teachers/teachersPage';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/letsSpell" element={<LetsSpellActivity />} />
      <Route path="/letsSpell/setup" element={<LetsSpellSetup />} />
      <Route path="/letsCount" element={<LetsCountActivity />} />
      <Route path="/letsFind" element={<LetsFindActivity />} />
      <Route path="/letsFind/setup" element={<LetsFindSetup />} />
      <Route path="/teachers" element={<TeachersPage />} />
    </Routes>
  );
}

export default AppRoutes;
