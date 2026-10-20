import { createContext, useContext, useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import OptionsModal from '../optionsModal/optionsModal';
import './appShell.scss';

const AppShellContext = createContext({ isOptionsOpen: false });

export function useAppShell() {
  return useContext(AppShellContext);
}

function AppShell({ children }) {
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const contextValue = useMemo(() => ({ isOptionsOpen }), [isOptionsOpen]);

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
