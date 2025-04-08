import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { FormEvent, useEffect, useState } from 'react';
import { useDebounce } from '@/shared/hooks/useDebounce';

type SearchInputProps = {
  className?: string;
  onSearch: (query: string) => void;
};

export const SearchInput = ({ className, onSearch }: SearchInputProps) => {
  const [inputValue, setInputValue] = useState('');
  const debouncedSearchQuery = useDebounce(inputValue, 500);

  useEffect(() => {
    onSearch(debouncedSearchQuery);
  }, [debouncedSearchQuery, onSearch]);

  const handleClear = () => {
    setInputValue('');
    onSearch('');
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(debouncedSearchQuery);
  };

  return (
    <form onSubmit={handleSubmit}
          className={`relative ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
      </div>

      <input type="text"
             value={inputValue}
             onChange={(e) => setInputValue(e.target.value)}
             className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
             placeholder="Search recipes..." />

      {inputValue && (
        <button onClick={handleClear}
                className="absolute inset-y-0 right-0 pr-3 flex items-center group"
                aria-label="Clear search">
          <XMarkIcon className="w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors" />
        </button>
      )}
    </form>
  );
};
