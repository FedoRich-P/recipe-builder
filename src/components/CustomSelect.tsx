import React, { useEffect, useRef, useState } from 'react';
import { HiChevronDown } from 'react-icons/hi';

export interface Option<T> {
  value: T;
  label: string;
}

export interface CustomSelectProps<T> {
  options: Option<T>[];
  value: T;
  onSelect: (value: T) => void;
  label?: string;
  error?: string;
  className?: string;
}

export const CustomSelect = <T,>(props: CustomSelectProps<T>) => {
  const {
    options,
    value,
    onSelect,
    label,
    error,
    className,
  } = props;

  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const toggleDropdown = () => setIsOpen(prev => !prev);

  const handleOptionSelect = (optionValue: T) => {
    onSelect(optionValue);
    setIsOpen(false);
  };

  // Закрытие при клике вне компонента
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={`mb-5 ${className}`} ref={wrapperRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <div
          className="cursor-pointer w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
          onClick={toggleDropdown}>
          <div className="flex justify-between items-center">
            <span>{options.find(o => o.value === value)?.label || 'Выберите значение'}</span>
            <HiChevronDown
              className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''} text-gray-400 w-5 h-5`} />
          </div>
        </div>
        {isOpen && (
          <div className="absolute w-full mt-2 border border-gray-300 rounded-lg bg-white shadow-lg z-10">
            <div className="max-h-48 overflow-y-auto">
              {options.map((option, index) => (
                <div key={index}
                     className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                     onClick={() => handleOptionSelect(option.value)}>
                  {option.label}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};
