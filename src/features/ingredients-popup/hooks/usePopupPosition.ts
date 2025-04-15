import { RefObject, useEffect, useState } from 'react';
import { PopupPosition } from '@/entities/recipe/model/types/recipe';

export const usePopupPosition = (
  moreButtonRef: RefObject<HTMLElement | null>,
  popupRef: RefObject<HTMLElement | null>
)  => {
  const [position, setPosition] = useState<PopupPosition>({ top: 0, left: 0 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const updatePosition = () => {
      const button = moreButtonRef.current;
      const popup = popupRef.current;

      if (button && popup) {
        const buttonRect = button.getBoundingClientRect();
        const popupWidth = popup.offsetWidth;
        const popupHeight = popup.offsetHeight;

        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

        let top = buttonRect.bottom + 8;
        const spaceBelow = screenHeight - buttonRect.bottom;
        const spaceAbove = buttonRect.top;

        if (spaceBelow < popupHeight && spaceAbove > popupHeight) {
          top = buttonRect.top - popupHeight - 8;
        }

        let left = buttonRect.left;
        if (left + popupWidth > screenWidth) {
          left = screenWidth - popupWidth - 10;
        }
        left = Math.max(left, 10);

        setPosition({ top, left });
        setVisible(true);
      }
    };
    updatePosition();
    window.addEventListener('resize', updatePosition);

    return () => {
      window.removeEventListener('resize', updatePosition);
    };
  }, [moreButtonRef]);

  return { position, visible };
};
