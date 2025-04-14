import React, { ChangeEvent, FormEvent, useEffect, useState, useRef, useCallback, memo } from 'react'; // Добавил React и memo
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useDebounce } from '@/shared/lib/hooks/useDebounce';
import { useAutocompleteSuggestions } from '@/shared/lib/hooks/useAutocompleteSuggestions';
import { SuggestionsList } from '@/shared/ui/SuggestionsList';

type SearchInputProps = {
  className?: string;
  onSearch: (query: string) => void;
  initialValue?: string;
  suggestions?: string[];
};

export const SearchInput = memo((props: SearchInputProps) => {
  const { className, onSearch, initialValue = '', suggestions = [] } = props;

  const [inputValue, setInputValue] = useState(initialValue);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);

  const searchContainerRef = useRef<HTMLFormElement>(null);
  const suggestionsListRef = useRef<HTMLUListElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isProgrammaticUpdate = useRef(false);

  const debouncedInputValue = useDebounce(inputValue, 500);
  const {
    filteredSuggestions,
    showSuggestions,
    setShowSuggestions,
  } = useAutocompleteSuggestions<string>({
    inputValue,
    allSuggestions: suggestions,
    maxResults: 8,
  });

  // Вызов onSearch по debounce
  useEffect(() => {
    if (!isProgrammaticUpdate.current && debouncedInputValue !== initialValue) {
      onSearch(debouncedInputValue);
    }
    isProgrammaticUpdate.current = false;
  }, [debouncedInputValue, initialValue, onSearch]);

  // Синхронизация с внешним initialValue
  useEffect(() => {
    if (initialValue !== inputValue) {
      isProgrammaticUpdate.current = true;
      setInputValue(initialValue);
      if (!initialValue) {
        setShowSuggestions(false);
        setActiveSuggestionIndex(-1);
      }
    }
  }, [initialValue, setShowSuggestions]);

  // Скрытие подсказок при клике вне
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        if (showSuggestions) {
          setShowSuggestions(false);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showSuggestions, setShowSuggestions]);

  // Прокрутка активной подсказки
  useEffect(() => {
    if (activeSuggestionIndex < 0 || !showSuggestions || !suggestionsListRef.current) return;
    const listElement = suggestionsListRef.current;
    const activeItemElement = listElement.children[activeSuggestionIndex] as HTMLElement;
    if (activeItemElement) {
      const { offsetTop, offsetHeight } = activeItemElement;
      const { scrollTop, clientHeight } = listElement;
      const scrollBottom = scrollTop + clientHeight;
      const elementBottom = offsetTop + offsetHeight;
      if (elementBottom > scrollBottom) listElement.scrollTop = elementBottom - clientHeight;
      else if (offsetTop < scrollTop) listElement.scrollTop = offsetTop;
    }
  }, [activeSuggestionIndex, showSuggestions]);


  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    isProgrammaticUpdate.current = false;
    setInputValue(e.target.value);
    setActiveSuggestionIndex(-1);
  };

  const handleSuggestionClick = useCallback((suggestion: string) => {
    isProgrammaticUpdate.current = true;
    setInputValue(suggestion);
    setShowSuggestions(false);
    setActiveSuggestionIndex(-1);
    onSearch(suggestion);
    inputRef.current?.focus();
  }, [onSearch, setShowSuggestions]);

  const handleClear = useCallback(() => {
    isProgrammaticUpdate.current = true;
    setInputValue('');
    setShowSuggestions(false);
    setActiveSuggestionIndex(-1);
    onSearch('');
    inputRef.current?.focus();
  }, [onSearch, setShowSuggestions]);

  const handleSubmit = useCallback((e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (showSuggestions && activeSuggestionIndex >= 0 && activeSuggestionIndex < filteredSuggestions.length) {
      handleSuggestionClick(filteredSuggestions[activeSuggestionIndex]);
    } else {
      if (showSuggestions) setShowSuggestions(false);
      inputRef.current?.blur();
    }
  }, [
    showSuggestions,
    activeSuggestionIndex,
    filteredSuggestions,
    handleSuggestionClick,
    setShowSuggestions,
  ]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    const suggestionCount = filteredSuggestions.length;

    // Показываем при стрелке вниз, если скрыто, но есть что показать
    if (e.key === 'ArrowDown' && !showSuggestions && suggestionCount > 0 && inputValue.length > 0) {
      setShowSuggestions(true);
      // Не выходим, позволяем обработать ArrowDown ниже
    }
    // Основная обработка, если список виден или нажата Escape
    else if (showSuggestions || e.key === 'Escape') {
      if (suggestionCount === 0 && e.key !== 'Escape') return;

      switch (e.key) {
        case 'ArrowDown':
        case 'ArrowUp':
          e.preventDefault();
          setActiveSuggestionIndex(prev => (prev + (e.key === 'ArrowDown' ? 1 : -1) + suggestionCount) % suggestionCount);
          break;
        case 'Enter':
          break;
        case 'Escape':
          e.preventDefault();
          setShowSuggestions(false);
          setActiveSuggestionIndex(-1);
          break;
      }
    }
  }, [
    filteredSuggestions,
    showSuggestions,
    inputValue,
    setShowSuggestions,
    setActiveSuggestionIndex,
  ]);

  const handleFocus = useCallback(() => {
    if (inputValue.length > 0 && filteredSuggestions.length > 0) {
      setShowSuggestions(true);
    }
  }, [inputValue, filteredSuggestions, setShowSuggestions]); // Зависимости корректны

  const getSuggestionValue = useCallback((suggestion: string) => suggestion, []);

  const inputProps = {
    ref: inputRef,
    type: "text" as const,
    value: inputValue,
    onChange: handleInputChange,
    onKeyDown: handleKeyDown,
    onFocus: handleFocus,
    className: "block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-orange-500 focus:border-orange-500",
    placeholder: "Найти рецепт...",
    autoComplete: "off",
    role: "combobox",
    "aria-autocomplete": "list" as const,
    "aria-controls": "suggestions-list",
  };

  return (
    <form ref={searchContainerRef} onSubmit={handleSubmit} className={`relative ${className}`} role="search">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" aria-hidden="true">
          <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
        </div>
        <input {...inputProps} />
        {inputValue && (
          <button type="button"
                  onClick={handleClear}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center group"
                  aria-label="Очистить поиск">
            <XMarkIcon className="w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors" />
          </button>
        )}
      </div>

      {showSuggestions && filteredSuggestions.length > 0 && (
        <SuggestionsList<string> ref={suggestionsListRef}
                                 suggestions={filteredSuggestions}
                                 activeIndex={activeSuggestionIndex}
                                 onSuggestionClick={handleSuggestionClick}
                                 onMouseEnter={setActiveSuggestionIndex}
                                 getSuggestionValue={getSuggestionValue}
                                 listId="suggestions-list" />
      )}
    </form>
  );
});

