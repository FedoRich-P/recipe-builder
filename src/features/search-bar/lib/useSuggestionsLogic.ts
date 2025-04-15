import { useAutocompleteSuggestions } from '@/shared/lib/hooks/useAutocompleteSuggestions';

export const useSuggestionsLogic = (inputValue: string, suggestions: string[]) => {
  return useAutocompleteSuggestions<string>({
    inputValue,
    allSuggestions: suggestions,
    maxResults: 8,
  });
};
