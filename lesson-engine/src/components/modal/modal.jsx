import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import './modal.scss';

const MODAL_TRANSITION_MS = 180;
const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

function Modal({ children, isOpen, onClose, title }) {
  const [isRendered, setIsRendered] = useState(isOpen);
  const [isClosing, setIsClosing] = useState(false);
  const dialogRef = useRef(null);
  const onCloseRef = useRef(onClose);
  const returnFocusRef = useRef(null);
  const titleId = useId();

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
      setIsClosing(false);
    } else if (isRendered) {
      setIsClosing(true);
    }
  }, [isOpen, isRendered]);

  useEffect(() => {
    if (!isClosing) {
      return undefined;
    }

    const closeTimer = window.setTimeout(() => {
      setIsRendered(false);
      setIsClosing(false);
    }, MODAL_TRANSITION_MS);

    return () => window.clearTimeout(closeTimer);
  }, [isClosing]);

  useEffect(() => {
    if (!isRendered) {
      return undefined;
    }

    const appRoot = document.getElementById('root');
    const previousFocus = document.activeElement;
    const previousBodyOverflow = document.body.style.overflow;
    const previousRootAriaHidden = appRoot?.getAttribute('aria-hidden');
    const previousRootInert = appRoot?.inert;

    if (previousFocus instanceof HTMLElement) {
      returnFocusRef.current = previousFocus;
    }

    document.body.style.overflow = 'hidden';

    if (appRoot) {
      appRoot.inert = true;
      appRoot.setAttribute('aria-hidden', 'true');
    }

    const focusTimer = window.setTimeout(() => {
      const firstControl = dialogRef.current?.querySelector(FOCUSABLE_SELECTOR);
      (firstControl ?? dialogRef.current)?.focus({ preventScroll: true });
    }, 0);

    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = previousBodyOverflow;

      if (appRoot) {
        appRoot.inert = previousRootInert ?? false;

        if (previousRootAriaHidden === null) {
          appRoot.removeAttribute('aria-hidden');
        } else {
          appRoot.setAttribute('aria-hidden', previousRootAriaHidden);
        }
      }

      if (returnFocusRef.current?.isConnected) {
        returnFocusRef.current.focus({ preventScroll: true });
      }
    };
  }, [isRendered]);

  const finishClosing = () => {
    setIsRendered(false);
    setIsClosing(false);
  };

  const handleOverlayAnimationEnd = (event) => {
    if (isClosing && event.target === event.currentTarget) {
      finishClosing();
    }
  };

  const stopOverlayInteraction = (event) => {
    event.stopPropagation();
  };

  const handleDialogKeyDown = (event) => {
    event.stopPropagation();

    if (event.key === 'Escape') {
      event.preventDefault();
      onCloseRef.current?.();
      return;
    }

    if (event.key !== 'Tab') {
      return;
    }

    const focusableControls = Array.from(
      dialogRef.current?.querySelectorAll(FOCUSABLE_SELECTOR) ?? [],
    );
    const firstControl = focusableControls[0];
    const lastControl = focusableControls[focusableControls.length - 1];

    if (!firstControl) {
      event.preventDefault();
      dialogRef.current?.focus();
      return;
    }

    if (
      event.shiftKey &&
      (document.activeElement === firstControl || document.activeElement === dialogRef.current)
    ) {
      event.preventDefault();
      lastControl.focus();
    } else if (!event.shiftKey && document.activeElement === lastControl) {
      event.preventDefault();
      firstControl.focus();
    }
  };

  if (!isRendered) {
    return null;
  }

  return createPortal(
    <div
      className={`modal-overlay modal-overlay--${isClosing ? 'closing' : 'opening'}`}
      onAnimationEnd={handleOverlayAnimationEnd}
      onClick={stopOverlayInteraction}
      style={{ '--modal-transition-duration': `${MODAL_TRANSITION_MS}ms` }}
    >
      <section
        ref={dialogRef}
        className="app-modal"
        aria-labelledby={titleId}
        aria-modal="true"
        onKeyDown={handleDialogKeyDown}
        role="dialog"
        tabIndex={-1}
      >
        <header className="app-modal__header">
          <h2 className="app-modal__title" id={titleId}>
            {title}
          </h2>
          <button
            className="app-modal__close"
            aria-label="Close dialog"
            onClick={onClose}
            type="button"
          >
            <span aria-hidden="true">×</span>
          </button>
        </header>
        <div className="app-modal__content">{children}</div>
      </section>
    </div>,
    document.body,
  );
}

export default Modal;
