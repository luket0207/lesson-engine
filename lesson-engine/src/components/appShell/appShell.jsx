import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { useLocation } from 'react-router-dom';
import OptionsModal from '../optionsModal/optionsModal';
import './appShell.scss';

const AppShellContext = createContext({ isOptionsOpen: false });

export function useAppShell() {
  return useContext(AppShellContext);
}

function AppShell({ children }) {
  const location = useLocation();
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const contextValue = useMemo(() => ({ isOptionsOpen }), [isOptionsOpen]);
  const usesLetsSpellTheme =
    location.pathname === '/letsSpell' || location.pathname.startsWith('/letsSpell/');
  const usesLetsFindTheme =
    location.pathname === '/letsFind' || location.pathname.startsWith('/letsFind/');

  useEffect(() => {
    const letsSpellThemeClass = 'theme--lets-spell';
    const letsFindThemeClass = 'theme--lets-find';

    document.documentElement.classList.toggle(letsSpellThemeClass, usesLetsSpellTheme);
    document.documentElement.classList.toggle(letsFindThemeClass, usesLetsFindTheme);

    return () => {
      document.documentElement.classList.remove(letsSpellThemeClass, letsFindThemeClass);
    };
  }, [usesLetsFindTheme, usesLetsSpellTheme]);

  return (
    <AppShellContext.Provider value={contextValue}>
      <div className="app-shell">
        {children}
        <button
          className="app-shell__menu"
          aria-expanded={isOptionsOpen}
          aria-haspopup="dialog"
          aria-label="Open Options"
          onClick={() => setIsOptionsOpen(true)}
          type="button"
        >
          <FontAwesomeIcon icon={faBars} />
        </button>
        <OptionsModal
          isOpen={isOptionsOpen}
          onClose={() => setIsOptionsOpen(false)}
        />
      </div>
    </AppShellContext.Provider>
  );
}

export default AppShell;
