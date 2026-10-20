import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHouse,
  faPersonChalkboard,
} from '@fortawesome/free-solid-svg-icons';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../button/button';
import Modal from '../modal/modal';
import './optionsModal.scss';

function OptionsModal({ isOpen, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigation = (destination) => {
    onClose();

    if (location.pathname !== destination) {
      navigate(destination);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Options">
      <nav className="options-modal__actions" aria-label="Options navigation">
        <Button onClick={() => handleNavigation('/')} size="large" variant="secondary">
          <FontAwesomeIcon icon={faHouse} />
          <span>Return to home</span>
        </Button>
        <Button
          onClick={() => handleNavigation('/teachers')}
          size="large"
          variant="secondary"
        >
          <FontAwesomeIcon icon={faPersonChalkboard} />
          <span>For Teachers</span>
        </Button>
      </nav>
    </Modal>
  );
}

export default OptionsModal;
