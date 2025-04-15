import { memo } from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useSearchInputLogic } from '@/features/search-bar/lib/useSearchInputLogic';
import { SuggestionsList } from '@/shared/ui/SuggestionsList';

type SearchInputProps = {
  className?: string;
  onSearch: (query: string) => void;
  initialValue?: string;
  suggestions?: string[];
};

export const SearchInput = memo((props: SearchInputProps) => {
  const {
    className,
    initialValue = '',
    onSearch,
    suggestions = [],
  } = props;

  const {
    inputRef,
    formRef,
    suggestionsListRef,
    inputValue,
    filteredSuggestions,
    activeSuggestionIndex,
    showSuggestions,
    handleChange,
    handleFocus,
    handleClear,
    handleSubmit,
    handleKeyDown,
    handleSuggestionClick,
    setActiveSuggestionIndex,
  } = useSearchInputLogic({ initialValue, onSearch, suggestions });

  return (
    <form ref={formRef} onSubmit={handleSubmit} className={`relative ${className}`} role="search">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" aria-hidden="true">
          <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
        </div>
        <input ref={inputRef}
               type="text"
               value={inputValue}
               onChange={handleChange}
               onKeyDown={handleKeyDown}
               onFocus={handleFocus}
               className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
               placeholder="Найти рецепт..."
               autoComplete="off"
               role="combobox"
               aria-autocomplete="list"
               aria-controls="suggestions-list" />
        {inputValue && (
          <button type="button"
                  onClick={handleClear}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center group"
                  aria-label="Очистить поиск">
            <XMarkIcon className="w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors" />
          </button>)}
      </div>

      {showSuggestions && filteredSuggestions.length > 0 && (
        <SuggestionsList<string> ref={suggestionsListRef}
                                 suggestions={filteredSuggestions}
                                 activeIndex={activeSuggestionIndex}
                                 onSuggestionClick={handleSuggestionClick}
                                 onMouseEnter={setActiveSuggestionIndex}
                                 getSuggestionValue={(s) => s}
                                 listId="suggestions-list" />)}
    </form>
  );
});
