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

  useEffect(() => {
    const themeClass = 'theme--lets-spell';
    document.documentElement.classList.toggle(themeClass, usesLetsSpellTheme);

    return () => document.documentElement.classList.remove(themeClass);
  }, [usesLetsSpellTheme]);

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
