import { useClickOutside } from '@/shared/lib/hooks/useClickOutside';
import { RefObject } from 'react';

export const useOutsideClickHandler = (
  formRef: RefObject<HTMLElement | null>,
  suggestionsListRef: RefObject<HTMLElement | null>,
  setShowSuggestions: (v: (prev: boolean) => boolean) => void,
  setInputValue: (v: string) => void
) => {
  useClickOutside(
    formRef,
    () => {
      setShowSuggestions(prev => !prev);
      setInputValue('');
    },
    suggestionsListRef
  );
};