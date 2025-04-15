import {
  useRef,
  useState,
  useEffect,
  useCallback,
} from 'react';

import { useDebounce } from '@/shared/lib/hooks/useDebounce';
import { useScrollToActiveItem } from '@/shared/lib/hooks/useScrollToActiveItem';
import { useInputHandlers } from './useInputHandlers';
import { useSuggestionsLogic } from './useSuggestionsLogic';
import { useKeyboardNavigation } from './useKeyboardNavigation';
import { useOutsideClickHandler } from './useOutsideClickHandler';

type UseSearchInputLogicParams = {
  initialValue: string;
  onSearch: (query: string) => void;
  suggestions: string[];
};

export const useSearchInputLogic = (props: UseSearchInputLogicParams) => {
  const { initialValue, onSearch, suggestions} = props

  const [inputValue, setInputValue] = useState(initialValue);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const suggestionsListRef = useRef<HTMLUListElement | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);
  const preventFocusRef = useRef(false);

  const debouncedInputValue = useDebounce(inputValue, 500);

  const {
    filteredSuggestions,
    showSuggestions,
    setShowSuggestions,
  } = useSuggestionsLogic(inputValue, suggestions);

  const { handleChange, handleClear, isProgrammaticUpdate } = useInputHandlers({
    onSearch,
    setInputValue,
    setShowSuggestions,
    setActiveSuggestionIndex,
    inputRef,
  });

  const { handleKeyDown } = useKeyboardNavigation({
    filteredSuggestions,
    showSuggestions,
    inputValue,
    setActiveSuggestionIndex,
    setShowSuggestions,
  });

  useOutsideClickHandler(formRef, suggestionsListRef, setShowSuggestions, setInputValue);

  useEffect(() => {
    if (!isProgrammaticUpdate.current && debouncedInputValue !== initialValue) {
      onSearch(debouncedInputValue);
    }
    isProgrammaticUpdate.current = false;
  }, [debouncedInputValue, initialValue, onSearch]);

  useEffect(() => {
    if (initialValue !== inputValue) {
      isProgrammaticUpdate.current = true;
      setInputValue(initialValue);
      setShowSuggestions(false);
      setActiveSuggestionIndex(-1);
    }
  }, [initialValue, setShowSuggestions]);

  useScrollToActiveItem(suggestionsListRef, activeSuggestionIndex, showSuggestions);

  const handleSuggestionClick = useCallback(
    (suggestion: string) => {
      isProgrammaticUpdate.current = true;
      setInputValue(suggestion);
      setShowSuggestions(false);
      setActiveSuggestionIndex(-1);
      onSearch(suggestion);
      inputRef.current?.focus();
    },
    [onSearch, setShowSuggestions]
  );

  const handleFocus = useCallback(() => {
    if (preventFocusRef.current) {
      preventFocusRef.current = false;
      return;
    }

    if (inputValue.length > 0 && filteredSuggestions.length > 0) {
      setShowSuggestions(true);
    }
  }, [inputValue, filteredSuggestions]);

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (
        showSuggestions &&
        activeSuggestionIndex >= 0 &&
        activeSuggestionIndex < filteredSuggestions.length
      ) {
        handleSuggestionClick(filteredSuggestions[activeSuggestionIndex]);
      } else {
        setShowSuggestions(false);
        inputRef.current?.blur();
      }
    },
    [
      showSuggestions,
      activeSuggestionIndex,
      filteredSuggestions,
      handleSuggestionClick,
      setShowSuggestions,
    ]
  );

  return {
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
  };
};



// export const useSearchInputLogic = ({
//                                       initialValue,
//                                       onSearch,
//                                       suggestions,
//                                     }: UseSearchInputLogicParams) => {
//   const [inputValue, setInputValue] = useState(initialValue);
//   const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
//   const isProgrammaticUpdate = useRef(false);
//   const inputRef = useRef<HTMLInputElement>(null);
//   const suggestionsListRef = useRef<HTMLUListElement>(null);
//   const formRef = useRef<HTMLFormElement>(null);
//
//   const debouncedInputValue = useDebounce(inputValue, 500);
//
//   const {
//     filteredSuggestions,
//     showSuggestions,
//     setShowSuggestions,
//   } = useAutocompleteSuggestions<string>({
//     inputValue,
//     allSuggestions: suggestions,
//     maxResults: 8,
//   });
//
//   useEffect(() => {
//     if (!isProgrammaticUpdate.current && debouncedInputValue !== initialValue) {
//       onSearch(debouncedInputValue);
//     }
//     isProgrammaticUpdate.current = false;
//   }, [debouncedInputValue, initialValue, onSearch]);
//
//   useEffect(() => {
//     if (initialValue !== inputValue) {
//       isProgrammaticUpdate.current = true;
//       setInputValue(initialValue);
//       setShowSuggestions(false);
//       setActiveSuggestionIndex(-1);
//     }
//   }, [initialValue, setShowSuggestions]);
//
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         formRef.current &&
//         !formRef.current.contains(event.target as Node)
//       ) {
//         setShowSuggestions(false);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, [setShowSuggestions]);
//
//   useEffect(() => {
//     if (
//       activeSuggestionIndex < 0 ||
//       !showSuggestions ||
//       !suggestionsListRef.current
//     )
//       return;
//
//     const listElement = suggestionsListRef.current;
//     const activeItem = listElement.children[
//       activeSuggestionIndex
//       ] as HTMLElement;
//     if (activeItem) {
//       const { offsetTop, offsetHeight } = activeItem;
//       const { scrollTop, clientHeight } = listElement;
//       const scrollBottom = scrollTop + clientHeight;
//       const elementBottom = offsetTop + offsetHeight;
//       if (elementBottom > scrollBottom)
//         listElement.scrollTop = elementBottom - clientHeight;
//       else if (offsetTop < scrollTop) listElement.scrollTop = offsetTop;
//     }
//   }, [activeSuggestionIndex, showSuggestions]);
//
//   const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
//     isProgrammaticUpdate.current = false;
//     setInputValue(e.target.value);
//     setActiveSuggestionIndex(-1);
//   }, []);
//
//   const handleClear = useCallback(() => {
//     isProgrammaticUpdate.current = true;
//     setInputValue('');
//     setShowSuggestions(false);
//     setActiveSuggestionIndex(-1);
//     onSearch('');
//     inputRef.current?.focus();
//   }, [onSearch, setShowSuggestions]);
//
//   const handleSuggestionClick = useCallback(
//     (suggestion: string) => {
//       isProgrammaticUpdate.current = true;
//       setInputValue(suggestion);
//       setShowSuggestions(false);
//       setActiveSuggestionIndex(-1);
//       onSearch(suggestion);
//       inputRef.current?.focus();
//     },
//     [onSearch, setShowSuggestions]
//   );
//
//   const handleKeyDown = useCallback(
//     (e: React.KeyboardEvent<HTMLInputElement>) => {
//       const count = filteredSuggestions.length;
//
//       if (e.key === 'ArrowDown' && !showSuggestions && count > 0 && inputValue.length > 0) {
//         setShowSuggestions(true);
//       } else if (showSuggestions || e.key === 'Escape') {
//         if (count === 0 && e.key !== 'Escape') return;
//
//         switch (e.key) {
//           case 'ArrowDown':
//           case 'ArrowUp':
//             e.preventDefault();
//             setActiveSuggestionIndex(
//               prev => (prev + (e.key === 'ArrowDown' ? 1 : -1) + count) % count
//             );
//             break;
//           case 'Escape':
//             e.preventDefault();
//             setShowSuggestions(false);
//             setActiveSuggestionIndex(-1);
//             break;
//         }
//       }
//     },
//     [filteredSuggestions, showSuggestions, inputValue]
//   );
//
//   const handleFocus = useCallback(() => {
//     if (inputValue.length > 0 && filteredSuggestions.length > 0) {
//       setShowSuggestions(true);
//     }
//   }, [inputValue, filteredSuggestions]);
//
//   const handleSubmit = useCallback(
//     (e: FormEvent<HTMLFormElement>) => {
//       e.preventDefault();
//       if (
//         showSuggestions &&
//         activeSuggestionIndex >= 0 &&
//         activeSuggestionIndex < filteredSuggestions.length
//       ) {
//         handleSuggestionClick(filteredSuggestions[activeSuggestionIndex]);
//       } else {
//         setShowSuggestions(false);
//         inputRef.current?.blur();
//       }
//     },
//     [
//       showSuggestions,
//       activeSuggestionIndex,
//       filteredSuggestions,
//       handleSuggestionClick,
//       setShowSuggestions,
//     ]
//   );
//
//   return {
//     inputRef,
//     formRef,
//     suggestionsListRef,
//     inputValue,
//     filteredSuggestions,
//     activeSuggestionIndex,
//     showSuggestions,
//     handleChange,
//     handleFocus,
//     handleClear,
//     handleSubmit,
//     handleKeyDown,
//     handleSuggestionClick,
//     setActiveSuggestionIndex,
//   };
// };
