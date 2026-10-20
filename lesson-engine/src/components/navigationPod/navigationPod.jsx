import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import './navigationPod.scss';

function NavigationPod({ icon, label, size = 'default', to }) {
  const className =
    size === 'tall' ? 'navigation-pod navigation-pod--tall' : 'navigation-pod';

  return (
    <Link
      className={className}
      data-directional-navigation-item=""
      to={to}
    >
      <FontAwesomeIcon
        aria-hidden="true"
        className="navigation-pod__icon"
        focusable="false"
        icon={icon}
      />
      <span className="navigation-pod__label">{label}</span>
    </Link>
  );
}

export default NavigationPod;
