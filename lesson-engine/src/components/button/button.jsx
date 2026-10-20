import { Link } from 'react-router-dom';
import './button.scss';

const BUTTON_VARIANTS = ['primary', 'secondary', 'tertiary'];
const BUTTON_SIZES = ['regular', 'large'];

function Button({
  children,
  className = '',
  disabled = false,
  onClick,
  selected,
  size = 'regular',
  tabIndex,
  text,
  to,
  type = 'button',
  variant = 'primary',
  ...rest
}) {
  const resolvedVariant = BUTTON_VARIANTS.includes(variant) ? variant : 'primary';
  const resolvedSize = BUTTON_SIZES.includes(size) ? size : 'regular';
  const classes = [
    'app-button',
    `app-button--${resolvedVariant}`,
    `app-button--${resolvedSize}`,
    selected ? 'app-button--selected' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');
  const content = children ?? text;

  if (to) {
    const handleLinkClick = (event) => {
      if (disabled) {
        event.preventDefault();
        return;
      }

      onClick?.(event);
    };

    return (
      <Link
        {...rest}
        aria-current={selected ? 'page' : undefined}
        aria-disabled={disabled || undefined}
        className={classes}
        onClick={handleLinkClick}
        tabIndex={disabled ? -1 : tabIndex}
        to={to}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      {...rest}
      aria-pressed={selected === undefined ? undefined : selected}
      className={classes}
      disabled={disabled}
      onClick={onClick}
      tabIndex={tabIndex}
      type={type}
    >
      {content}
    </button>
  );
}

export default Button;
