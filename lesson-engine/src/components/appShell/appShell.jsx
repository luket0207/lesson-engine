import { createContext, useContext, useLayoutEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse } from '@fortawesome/free-solid-svg-icons';
import { useLocation, useNavigate } from 'react-router-dom';
import './appShell.scss';

const AppShellContext = createContext({ isOptionsOpen: false });
const APP_SHELL_CONTEXT_VALUE = { isOptionsOpen: false };

export function useAppShell() {
  return useContext(AppShellContext);
}

function AppShell({ children, themeLocation }) {
  const location = useLocation();
  const navigate = useNavigate();
  const themePathname = themeLocation?.pathname ?? location.pathname;
  const usesLetsSpellTheme =
    themePathname === '/letsSpell' || themePathname.startsWith('/letsSpell/');
  const usesLetsFindTheme =
    themePathname === '/letsFind' || themePathname.startsWith('/letsFind/');

  useLayoutEffect(() => {
    const letsSpellThemeClass = 'theme--lets-spell';
    const letsFindThemeClass = 'theme--lets-find';

    document.documentElement.classList.toggle(letsSpellThemeClass, usesLetsSpellTheme);
    document.documentElement.classList.toggle(letsFindThemeClass, usesLetsFindTheme);

    return () => {
      document.documentElement.classList.remove(letsSpellThemeClass, letsFindThemeClass);
    };
  }, [usesLetsFindTheme, usesLetsSpellTheme]);

  const goHome = () => {
    if (location.pathname !== '/') {
      navigate('/');
    }
  };

  return (
    <AppShellContext.Provider value={APP_SHELL_CONTEXT_VALUE}>
      <div className="app-shell">
        {children}
        <button
          className="app-shell__menu"
          aria-label="Go to Home"
          onClick={goHome}
          type="button"
        >
          <FontAwesomeIcon icon={faHouse} />
        </button>
      </div>
    </AppShellContext.Provider>
  );
}

export default AppShell;
