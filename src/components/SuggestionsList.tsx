import { ForwardedRef, forwardRef, ReactElement } from 'react';

type SuggestionsListProps<T> = {
  suggestions: T[];
  activeIndex: number;
  onSuggestionClick: (suggestion: T) => void;
  onMouseEnter: (index: number) => void;
  getSuggestionValue: (suggestion: T) => string;
  listId?: string;
};

function SuggestionsListInner<T>(props: SuggestionsListProps<T>, ref: ForwardedRef<HTMLUListElement>) {
  const {
    suggestions,
    activeIndex,
    onSuggestionClick,
    onMouseEnter,
    getSuggestionValue,
    listId = 'suggestions-list',
  } = props;

  return (
    <ul ref={ref}
        id={listId}
        role="listbox"
        className="absolute mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto z-50 custom-scrollbar">
      {suggestions.map((suggestion, index) => {
        const value = getSuggestionValue(suggestion);
        const itemId = `suggestion-item-${index}`;
        return (
          <li key={itemId}
              id={itemId}
              role="option"
              aria-selected={index === activeIndex}
              className={`px-4 py-2 cursor-pointer hover:bg-orange-100 ${
                index === activeIndex ? 'bg-orange-200' : ''
              }`}
              onMouseDown={(e) => {
                e.preventDefault();
                onSuggestionClick(suggestion);
              }}
              onMouseEnter={() => onMouseEnter(index)}>
            {value}
          </li>
        );
      })}
    </ul>
  );
}

export const SuggestionsList = forwardRef(SuggestionsListInner) as <T>(
  props: SuggestionsListProps<T> & { ref?: ForwardedRef<HTMLUListElement> }) => ReactElement;