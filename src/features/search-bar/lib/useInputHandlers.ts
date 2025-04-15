import { useRef, useCallback, RefObject, ChangeEvent } from 'react';

type InputHandlersProps = {
  onSearch: (query: string) => void;
  setInputValue: (v: string) => void;
  setShowSuggestions: (v: boolean) => void;
  setActiveSuggestionIndex: (v: number) => void;
  inputRef: RefObject<HTMLInputElement | null>;
};

export const useInputHandlers = (props: InputHandlersProps) => {
  const{
      onSearch,
      setInputValue,
      setShowSuggestions,
      setActiveSuggestionIndex,
      inputRef,
  } = props

  const isProgrammaticUpdate = useRef(false);

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    isProgrammaticUpdate.current = false;
    setInputValue(e.target.value);
    setActiveSuggestionIndex(-1);
  }, []);

  const handleClear = useCallback(() => {
    isProgrammaticUpdate.current = true;
    setInputValue('');
    setShowSuggestions(false);
    setActiveSuggestionIndex(-1);
    onSearch('');
    inputRef.current?.focus();
  }, [onSearch, setShowSuggestions]);

  return {
    handleChange,
    handleClear,
    isProgrammaticUpdate,
  };
};
