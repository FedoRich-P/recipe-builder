// SearchInput.tsx
import React, { ChangeEvent, FormEvent, useEffect, useState, useRef, useCallback } from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useDebounce } from '@/shared/lib/hooks/useDebounce';

// --- Типы ---
type SuggestionsListProps = {
  suggestions: string[];
  activeIndex: number;
  onSuggestionClick: (suggestion: string) => void;
  onMouseEnter: (index: number) => void;
};

type SearchInputProps = {
  className?: string;
  onSearch: (query: string) => void;
  initialValue?: string;
  suggestions?: string[];
  suggestionType?: 'name' | 'category';
};

// --- Внутренний Компонент Списка Подсказок ---
const SuggestionsList: React.FC<SuggestionsListProps> = React.memo(({ // Добавляем React.memo
                                                                      suggestions,
                                                                      activeIndex,
                                                                      onSuggestionClick,
                                                                      onMouseEnter,
                                                                    }) => {
  console.log("Rendering SuggestionsList"); // Лог для проверки рендеров
  return (
    <ul
      id="suggestions-list"
      role="listbox"
      className="absolute mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto z-50 custom-scrollbar" // z-50, добавлен custom-scrollbar
    >
      {suggestions.map((suggestion, index) => (
        <li
          key={`${suggestion}-${index}`}
          role="option"
          aria-selected={index === activeIndex}
          className={`px-4 py-2 cursor-pointer hover:bg-orange-100 ${
            index === activeIndex ? 'bg-orange-200' : ''
          }`}
          onMouseDown={(e) => {
            e.preventDefault();
            onSuggestionClick(suggestion);
          }}
          onMouseEnter={() => onMouseEnter(index)}
        >
          {suggestion}
        </li>
      ))}
    </ul>
  );
});
// Добавляем displayName для DevTools
SuggestionsList.displayName = 'SuggestionsList';


// --- Основной Компонент SearchInput ---
export const SearchInput = ({
                              className,
                              onSearch,
                              initialValue = '',
                              suggestions = [],
                            }: SearchInputProps) => {
  console.log("Rendering SearchInput, initialValue:", initialValue); // Лог для проверки рендеров

  // --- Состояния ---
  const [inputValue, setInputValue] = useState(initialValue); // Инициализируем локальное состояние из пропа
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);

  // --- Хуки ---
  const debouncedInputValue = useDebounce(inputValue, 500); // Дебаунсим локальное значение
  const searchContainerRef = useRef<HTMLFormElement>(null);
  // Флаг, чтобы отличить программное обновление от пользовательского ввода
  const isProgrammaticUpdate = useRef(false);

  // --- Эффекты ---

  // Эффект для вызова onSearch по дебаунсу
  // Он сработает после ввода пользователя и паузы
  useEffect(() => {
    // Вызываем onSearch только если значение было изменено НЕ программно
    // и оно отличается от того, что уже есть в initialValue (пришедшего из Redux)
    if (!isProgrammaticUpdate.current && debouncedInputValue !== initialValue) {
      console.log(`Debounce Effect: Calling onSearch with "${debouncedInputValue}"`);
      onSearch(debouncedInputValue);
    }
    // Сбрасываем флаг после проверки
    isProgrammaticUpdate.current = false;
  }, [debouncedInputValue, initialValue, onSearch]); // Добавляем initialValue в зависимости

  // Эффект для синхронизации ЛОКАЛЬНОГО состояния с ПРОПОМ initialValue
  // Он сработает, когда Redux обновится (например, после onSearch или очистки)
  useEffect(() => {
    console.log(`Sync Effect: initialValue is "${initialValue}", inputValue is "${inputValue}"`);
    // Если проп initialValue отличается от локального inputValue,
    // значит, произошло внешнее обновление (Redux) - синхронизируемся
    if (initialValue !== inputValue) {
      console.log(`Sync Effect: Setting inputValue to "${initialValue}"`);
      // Ставим флаг, что это программное обновление
      isProgrammaticUpdate.current = true;
      setInputValue(initialValue);

      // Если initialValue пуст (очистка), скрываем подсказки
      if (!initialValue) {
        console.log(`Sync Effect: Hiding suggestions because initialValue is empty`);
        setShowSuggestions(false);
        setFilteredSuggestions([]);
        setActiveSuggestionIndex(-1);
      }
    }
  }, [initialValue]); // Зависим ТОЛЬКО от initialValue

  // Эффект для скрытия подсказок при клике вне
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // --- Обработчики ---

  // Изменение инпута пользователем
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    // Сбрасываем флаг, т.к. это пользовательский ввод
    isProgrammaticUpdate.current = false;
    setInputValue(query);
    setActiveSuggestionIndex(-1);

    // Фильтруем и показываем подсказки
    if (query.length > 0 && suggestions.length > 0) {
      const lowerCaseQuery = query.toLowerCase();
      const matches = suggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(lowerCaseQuery)
      ).slice(0, 8);
      setFilteredSuggestions(matches);
      setShowSuggestions(matches.length > 0);
    } else {
      setFilteredSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Клик по подсказке
  const handleSuggestionClick = useCallback((suggestion: string) => {
    console.log(`Suggestion clicked: "${suggestion}"`);
    // Ставим флаг, что следующее изменение будет программным
    isProgrammaticUpdate.current = true;
    // Обновляем локальное состояние
    setInputValue(suggestion);
    // Скрываем и чистим подсказки
    setFilteredSuggestions([]);
    setShowSuggestions(false);
    setActiveSuggestionIndex(-1);
    // Сразу вызываем onSearch, чтобы Redux обновился
    console.log(`Suggestion Click: Calling onSearch with "${suggestion}"`);
    onSearch(suggestion);
    // Фокусируемся на инпуте
    searchContainerRef.current?.querySelector('input')?.focus();
  }, [onSearch]); // Зависим только от onSearch

  // Клик по кнопке очистки
  const handleClear = useCallback(() => {
    console.log("Clear button clicked");
    // Ставим флаг
    isProgrammaticUpdate.current = true;
    // Обновляем локальное состояние
    setInputValue('');
    // Скрываем и чистим подсказки
    setFilteredSuggestions([]);
    setShowSuggestions(false);
    setActiveSuggestionIndex(-1);
    // Вызываем onSearch с пустой строкой
    console.log("Clear Click: Calling onSearch with ''");
    onSearch('');
  }, [onSearch]); // Зависим только от onSearch

  // Отправка формы (Enter)
  const handleSubmit = useCallback((e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Если выбрана подсказка стрелками
    if (showSuggestions && activeSuggestionIndex >= 0 && activeSuggestionIndex < filteredSuggestions.length) {
      handleSuggestionClick(filteredSuggestions[activeSuggestionIndex]);
    } else {
      // Если пользователь нажал Enter просто в поле ввода
      console.log(`Submit: Hiding suggestions. Search for "${inputValue}" will happen via debounce or was already triggered.`);
      setShowSuggestions(false); // Скрываем подсказки
      // Можно принудительно вызвать onSearch, если нужно не ждать debounce при Enter
      // if (inputValue !== initialValue) { // Вызываем только если значение отличается от уже отправленного
      //    isProgrammaticUpdate.current = true; // Ставим флаг, т.к. это не debounce
      //    onSearch(inputValue);
      // }
    }
  }, [showSuggestions, activeSuggestionIndex, filteredSuggestions, handleSuggestionClick, inputValue, initialValue, onSearch]);

  // Навигация клавиатурой
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (filteredSuggestions.length === 0 && e.key !== 'Escape') return; // Выходим, если нет подсказок (кроме Escape)

    switch (e.key) {
      case 'ArrowDown':
        if (showSuggestions) {
          e.preventDefault();
          setActiveSuggestionIndex(prev => (prev + 1) % filteredSuggestions.length);
        } else if (inputValue.length > 0 && filteredSuggestions.length > 0) {
          // Если подсказки скрыты, но могли бы быть - показываем их
          setShowSuggestions(true);
          setActiveSuggestionIndex(0);
        }
        break;
      case 'ArrowUp':
        if (showSuggestions) {
          e.preventDefault();
          setActiveSuggestionIndex(prev => (prev - 1 + filteredSuggestions.length) % filteredSuggestions.length);
        }
        break;
      case 'Enter':
        // Обрабатывается в handleSubmit
        break;
      case 'Escape':
        setShowSuggestions(false);
        setActiveSuggestionIndex(-1);
        break;
    }
  }, [showSuggestions, filteredSuggestions.length, inputValue.length]); // Зависим от showSuggestions и длины списков

  // --- Рендеринг ---
  return (
    <form ref={searchContainerRef}
          onSubmit={handleSubmit}
          className={`relative ${className}`}>
      {/* Инпут и иконки */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={inputValue} // Всегда рендерим локальное значение
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          placeholder="Найти рецепт..."
          autoComplete="off"
          aria-autocomplete="list"
          aria-controls="suggestions-list"
          aria-expanded={showSuggestions}
          onFocus={() => {
            // Показываем подсказки при фокусе, если есть что показывать
            if (inputValue.length > 0 && filteredSuggestions.length > 0) {
              setShowSuggestions(true);
            }
          }}
        />
        {inputValue && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center group"
            aria-label="Очистить поиск"
          >
            <XMarkIcon className="w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors" />
          </button>
        )}
      </div>

      {/* Список подсказок */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <SuggestionsList
          suggestions={filteredSuggestions}
          activeIndex={activeSuggestionIndex}
          onSuggestionClick={handleSuggestionClick}
          onMouseEnter={setActiveSuggestionIndex}
        />
      )}
    </form>
  );
};


// // SearchInput.tsx
// import React, { ChangeEvent, FormEvent, useEffect, useState, useRef, useCallback } from 'react';
// import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
// import { useDebounce } from '@/shared/lib/hooks/useDebounce';
//
// type SearchInputProps = {
//   className?: string;
//   onSearch: (query: string) => void;
//   initialValue?: string;
//   suggestions?: string[]; // Массив строк для подсказок
//   suggestionType?: 'name' | 'category'; // Тип подсказок (опционально)
// };
//
// export const SearchInput = ({
//                               className,
//                               onSearch,
//                               initialValue = '',
//                               suggestions = [], // По умолчанию пустой массив
//                               suggestionType = 'name',
//                             }: SearchInputProps) => {
//   const [inputValue, setInputValue] = useState(initialValue);
//   const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
//   const [showSuggestions, setShowSuggestions] = useState(false);
//   const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1); // Для навигации клавиатурой
//
//   const debouncedSearchQuery = useDebounce(inputValue, 500);
//   const searchContainerRef = useRef<HTMLFormElement>(null); // Ref для контейнера
//
//   // Эффект для вызова onSearch при изменении debounced значения
//   useEffect(() => {
//     // Вызываем onSearch только если значение действительно изменилось И это не результат выбора подсказки
//     // (дополнительная проверка, чтобы избежать лишних вызовов)
//     // В принципе, основной вызов onSearch теперь будет при выборе подсказки или по дебаунсу
//     onSearch(debouncedSearchQuery);
//   }, [debouncedSearchQuery, onSearch]);
//
//   // Синхронизация с initialValue извне (например, при очистке через Redux)
//   useEffect(() => {
//     setInputValue(initialValue);
//     if (!initialValue) {
//       setShowSuggestions(false); // Скрываем подсказки при программной очистке
//     }
//   }, [initialValue]);
//
//   // Обработка ввода и фильтрация подсказок
//   const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const query = e.target.value;
//     setInputValue(query);
//     setActiveSuggestionIndex(-1); // Сбрасываем выделение при вводе
//
//     if (query.length > 0 && suggestions.length > 0) {
//       const lowerCaseQuery = query.toLowerCase();
//       const matches = suggestions.filter(suggestion =>
//           suggestion.toLowerCase().includes(lowerCaseQuery), // Ищем вхождение подстроки
//         // Или startsWith, если нужно искать только начало:
//         // suggestion.toLowerCase().startsWith(lowerCaseQuery)
//       ).slice(0, 8); // Ограничиваем количество подсказок
//       setFilteredSuggestions(matches);
//       setShowSuggestions(matches.length > 0);
//     } else {
//       setFilteredSuggestions([]);
//       setShowSuggestions(false);
//     }
//   };
//
//   // Обработка клика по подсказке
//   const handleSuggestionClick = (suggestion: string) => {
//     setInputValue(suggestion); // Обновляем поле ввода
//     setFilteredSuggestions([]); // Очищаем список подсказок
//     setShowSuggestions(false); // Скрываем контейнер подсказок
//     onSearch(suggestion); // Немедленно запускаем поиск с выбранным значением
//     // Фокусируемся обратно на инпуте (опционально)
//     searchContainerRef.current?.querySelector('input')?.focus();
//   };
//
//   // Очистка поля
//   const handleClear = () => {
//     setInputValue('');
//     setFilteredSuggestions([]);
//     setShowSuggestions(false);
//     setActiveSuggestionIndex(-1);
//     onSearch('');
//   };
//
//   // Предотвращаем стандартное поведение формы
//   const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     // Если есть выделенная подсказка по Enter - выбираем ее
//     if (showSuggestions && activeSuggestionIndex >= 0 && activeSuggestionIndex < filteredSuggestions.length) {
//       handleSuggestionClick(filteredSuggestions[activeSuggestionIndex]);
//     } else {
//       // Иначе просто запускаем поиск с текущим значением (уже сделано через debounce)
//       // Можно скрыть подсказки, если они еще видны
//       setShowSuggestions(false);
//     }
//   };
//
//   // Обработка нажатий клавиш для навигации по подсказкам
//   const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (!showSuggestions || filteredSuggestions.length === 0) return;
//
//     switch (e.key) {
//       case 'ArrowDown':
//         e.preventDefault(); // Предотвращаем сдвиг курсора
//         setActiveSuggestionIndex(prev =>
//           prev < filteredSuggestions.length - 1 ? prev + 1 : 0, // Переход вниз или наверх
//         );
//         break;
//       case 'ArrowUp':
//         e.preventDefault(); // Предотвращаем сдвиг курсора
//         setActiveSuggestionIndex(prev =>
//           prev > 0 ? prev - 1 : filteredSuggestions.length - 1, // Переход вверх или вниз
//         );
//         break;
//       case 'Enter':
//         // Обработано в handleSubmit
//         break;
//       case 'Escape':
//         setShowSuggestions(false);
//         setActiveSuggestionIndex(-1);
//         break;
//       default:
//         break;
//     }
//   };
//
//   // Скрытие подсказок при клике вне компонента
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
//         setShowSuggestions(false);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);
//
//
//   return (
//     <form ref={searchContainerRef}
//           onSubmit={handleSubmit}
//           className={`relative ${className}`}>
//       <div className="relative"> {/* Обертка для инпута и иконок */}
//         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//           <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
//         </div>
//
//         <input type="text"
//                value={inputValue}
//                onChange={handleInputChange}
//                onKeyDown={handleKeyDown} // Добавляем обработчик нажатий
//                className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
//                placeholder="Найти рецепт..."
//                autoComplete="off" // Выключаем стандартные подсказки браузера
//                aria-autocomplete="list"
//                aria-controls="suggestions-list"
//                aria-expanded={showSuggestions} />
//
//         {inputValue && (
//           <button type="button"
//                   onClick={handleClear}
//                   className="absolute inset-y-0 right-0 pr-3 flex items-center group"
//                   aria-label="Очистить поиск">
//             <XMarkIcon className="w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors" />
//           </button>
//         )}
//       </div>
//
//       {/* Список подсказок */}
//       {showSuggestions && filteredSuggestions.length > 0 && (
//         <ul id="suggestions-list"
//             role="listbox"
//             className="absolute mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto z-1000">
//           {filteredSuggestions.map((suggestion, index) => (
//             <li key={suggestion + index} // Ключ должен быть уникальным
//                 role="option"
//                 aria-selected={index === activeSuggestionIndex}
//                 className={`px-4 py-2 cursor-pointer hover:bg-orange-100 ${
//                   index === activeSuggestionIndex ? 'bg-orange-200' : '' // Выделяем активную подсказку
//                 }`}
//                 onMouseDown={() => handleSuggestionClick(suggestion)}
//               // Можно добавить onMouseEnter для обновления activeSuggestionIndex при наведении мыши
//                 onMouseEnter={() => setActiveSuggestionIndex(index)}
//             >
//               {suggestion}
//             </li>
//           ))}
//         </ul>
//       )}
//     </form>
//   );
// };