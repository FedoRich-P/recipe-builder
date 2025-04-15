import { useCallback } from 'react';

type KeyboardNavigationProps = {
  filteredSuggestions: string[];
  showSuggestions: boolean;
  inputValue: string;
  setActiveSuggestionIndex: (v: (prev: number) => number) => void;
  setShowSuggestions: (v: boolean) => void;
};

export const useKeyboardNavigation = (props : KeyboardNavigationProps) => {
  const {
    filteredSuggestions,
    showSuggestions,
    inputValue,
    setActiveSuggestionIndex,
    setShowSuggestions,
  } = props;
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    const count = filteredSuggestions.length;

    if (e.key === 'ArrowDown' && !showSuggestions && count > 0 && inputValue.length > 0) {
      setShowSuggestions(true);
    } else if (showSuggestions || e.key === 'Escape') {
      if (count === 0 && e.key !== 'Escape') return;

      switch (e.key) {
        case 'ArrowDown':
        case 'ArrowUp':
          e.preventDefault();
          setActiveSuggestionIndex(
            prev => (prev + (e.key === 'ArrowDown' ? 1 : -1) + count) % count
          );
          break;
        case 'Escape':
          e.preventDefault();
          setShowSuggestions(false);
          setActiveSuggestionIndex(() => -1);
          break;
      }
    }
  }, [filteredSuggestions, showSuggestions, inputValue]);

  return { handleKeyDown };
};
