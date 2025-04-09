import { RefObject, useEffect, useRef } from 'react';
import { ClipboardIcon, XMarkIcon } from '@heroicons/react/24/outline';
import ReactDOM from 'react-dom';

export type IngredientsPopupProps = {
  ingredients: string[];
  onClose: () => void;
  moreButtonRef: RefObject<HTMLSpanElement | null>;
  recipeName: string;
};

export const IngredientsPopup = ({ ingredients, onClose, moreButtonRef, recipeName }: IngredientsPopupProps) => {
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  useEffect(() => {
    if (moreButtonRef.current && popupRef.current) {
      const buttonRect = moreButtonRef.current.getBoundingClientRect();
      const popup = popupRef.current;
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;

      const popupWidth = popup.offsetWidth;
      const popupHeight = popup.offsetHeight;
      const scrollY = window.scrollY;

      let top = buttonRect.bottom + 8 + scrollY;
      let left = buttonRect.left;

      if (top + popupHeight > screenHeight + scrollY) {
        top = buttonRect.top - popupHeight - 8 + scrollY;
      }

      if (left + popupWidth > screenWidth) {
        left = screenWidth - popupWidth - 10;
      }

      popup.style.top = `${top}px`;
      popup.style.left = `${left}px`;
    }
  }, [moreButtonRef]);

  const handleCopy = () => {
    const text = ingredients.join(', ');
    navigator.clipboard.writeText(text);
  };

  return ReactDOM.createPortal(
    <div ref={popupRef}
         className="fixed bg-white p-4 rounded-lg shadow-lg border border-gray-300 max-w-xs w-full z-50"
         style={{ maxHeight: '80vh', overflowY: 'auto' }}>
      <div className="relative pr-10">
        <button
          className="absolute top-2 right-2 text-red-600 border border-red-300 bg-white rounded-full p-1 hover:bg-red-100"
          onClick={onClose}
          aria-label="Close popup">
          <XMarkIcon className="w-5 h-5" />
        </button>
        <h4 className="text-lg font-semibold mb-2 text-gray-800 truncate pr-6" title={recipeName}>
          {recipeName} — Все ингредиенты
        </h4>
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <span>{ingredients.length} ингредиентов</span>
          <button className="flex items-center gap-1 text-blue-600 hover:underline text-xs"
                  onClick={handleCopy}>
            <ClipboardIcon className="w-4 h-4" /> Копировать список
          </button>
        </div>
        <ul className="space-y-1">
          {ingredients.map((ingredient, index) => (
            <li key={index} className="text-sm text-gray-700 flex items-center space-x-2">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              <span>{ingredient}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>,
    document.body,
  );
};
