import { RefObject, useEffect, useRef } from 'react';
import { ClipboardIcon, XMarkIcon } from '@heroicons/react/24/outline';
import ReactDOM from 'react-dom';
import { Ingredient } from '@/features/recipe/model/types/recipe';

export type IngredientsPopupProps = {
  ingredients: Ingredient[];
  onClose: () => void;
  moreButtonRef: RefObject<HTMLSpanElement | null>;
};

export const IngredientsPopup = ({ ingredients, onClose, moreButtonRef }: IngredientsPopupProps) => {
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
    const button = moreButtonRef.current;
    const popup = popupRef.current;

    if (button && popup) {
      const buttonRect = button.getBoundingClientRect();
      const popupWidth = popup.offsetWidth;
      const popupHeight = popup.offsetHeight;

      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;

      // Рассчитываем позицию по вертикали
      let top = buttonRect.bottom + 8;
      const spaceBelow = screenHeight - buttonRect.bottom;
      const spaceAbove = buttonRect.top;

      // Если не хватает места снизу и больше места сверху
      if (spaceBelow < popupHeight && spaceAbove > popupHeight) {
        top = buttonRect.top - popupHeight - 8;
      }

      // Рассчитываем позицию по горизонтали
      let left = buttonRect.left;
      if (left + popupWidth > screenWidth) {
        left = screenWidth - popupWidth - 10;
      }
      left = Math.max(left, 10); // Не прижимать к левому краю

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
         style={{
           maxHeight: '80vh',
           overflowY: 'auto',
           transform: 'translateZ(0)',
           margin: '8px 0',
         }}>
      <div className="relative pr-10">
        <button
          className="absolute top-2 right-2 text-red-600 border border-red-300 bg-white rounded-full p-1 hover:bg-red-100"
          onClick={onClose}
          aria-label="Close popup">
          <XMarkIcon className="w-5 h-5" />
        </button>
        <h4 className="text-lg font-semibold mb-2 text-gray-800 truncate pr-6">
          Все ингредиенты
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
              <span>{ingredient.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>,
    document.body,
  );
};
