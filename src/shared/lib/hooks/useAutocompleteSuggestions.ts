import { useState, useEffect } from 'react';

type UseAutocompleteOptions<T> = {
  inputValue: string;
  allSuggestions: T[];
  filterFn?: (suggestion: T, inputValue: string) => boolean;
  excludeList?: Set<string>;
  maxResults?: number;
};

export function useAutocompleteSuggestions<T extends string>( props: UseAutocompleteOptions<T>) {
   const {
     inputValue,
     allSuggestions,
     filterFn,
     excludeList,
     maxResults = 8,
   } = props
  const [filteredSuggestions, setFilteredSuggestions] = useState<T[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const trimmedInput = inputValue.trim(); // Используем trim для сравнения

    if (!trimmedInput || allSuggestions.length === 0) {
      if (showSuggestions) {
        setFilteredSuggestions([]);
        setShowSuggestions(false);
      }
      return;
    }

    const lowerCaseInput = inputValue.toLowerCase();

    const matches = allSuggestions
      .filter((suggestion) => {
        const match = filterFn
          ? filterFn(suggestion, inputValue)
          : typeof suggestion === 'string' &&
          suggestion.toLowerCase().includes(lowerCaseInput);

        const excluded = excludeList?.has(suggestion.trim()) ?? false;

        return match && !excluded;
      })
      .slice(0, maxResults);

    const shouldShow = matches.length > 0 && !(matches.length === 1 && matches[0] === trimmedInput);
    setFilteredSuggestions(matches);
    if (shouldShow !== showSuggestions) {
      setShowSuggestions(shouldShow);
    }

  }, [inputValue, allSuggestions, filterFn, excludeList, maxResults, showSuggestions]);



  return {
    filteredSuggestions,
    showSuggestions,
    setShowSuggestions,
  };
}