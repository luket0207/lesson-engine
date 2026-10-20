import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import './navigationPod.scss';

function NavigationPod({ children, icon, label, onClick, size = 'default', to, ...rest }) {
  const className =
    size === 'tall' ? 'navigation-pod navigation-pod--tall' : 'navigation-pod';
  const content = children ?? (
    <>
      {icon && (
        <FontAwesomeIcon
          aria-hidden="true"
          className="navigation-pod__icon"
          focusable="false"
          icon={icon}
        />
      )}
      <span className="navigation-pod__label">{label}</span>
    </>
  );

  if (to) {
    return (
      <Link
        {...rest}
        className={className}
        data-directional-navigation-item=""
        onClick={onClick}
        to={to}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      {...rest}
      className={className}
      data-directional-navigation-item=""
      onClick={onClick}
      type="button"
    >
      {content}
    </button>
  );
}

export default NavigationPod;
