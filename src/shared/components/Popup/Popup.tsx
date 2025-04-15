import { ReactNode, RefObject, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { usePopupPosition } from '@/features/ingredients-popup/hooks/usePopupPosition';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useClickOutside } from '@/shared/lib/hooks/useClickOutside';

interface PopupProps {
  children: ReactNode;
  moreButtonRef: RefObject<HTMLElement | null>;
  onClose: () => void;
}

export const Popup = ({ onClose, children, moreButtonRef }: PopupProps) => {
  const popupRef = useRef<HTMLDivElement>(null);

  useClickOutside(popupRef, onClose, moreButtonRef);
  const { position, visible } = usePopupPosition(moreButtonRef, popupRef);

  return ReactDOM.createPortal(
    <div
      ref={popupRef}
      className={`fixed bg-white p-4 rounded-lg shadow-lg border border-gray-300 max-w-xs w-full z-50 transition-opacity duration-300 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        maxHeight: '80vh',
        overflowY: 'auto',
        transform: 'translateZ(0)',
        margin: '8px 0',
      }}>
      <button
        className="absolute top-2 right-2 text-red-600 border border-red-300 bg-white rounded-full p-1 hover:bg-red-100 z-1000"
        onClick={ onClose}
        aria-label="Close popup">
        <XMarkIcon className="w-5 h-5" />
      </button>
      {children}
    </div>,
    document.body,
  );
};
