import React, { useState } from 'react';
import { HiChevronDown } from 'react-icons/hi';
import { FieldError } from 'react-hook-form';

type SelectCategoryProps = {
  categories: string[];
  error?: FieldError;
  onSelectCategory: (category: string) => void;
  selectedCategory: string;
};

export const SelectCategory = (props: SelectCategoryProps) => {
  const { categories, error, onSelectCategory, selectedCategory } = props;
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(prev => !prev);
  };

  const handleCategorySelect = (category: string) => {
    onSelectCategory(category);
    setIsOpen(false);
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">Категория</label>
      <div className="relative">
        <div
          className="cursor-pointer w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={toggleDropdown}>
          <div className="flex justify-between items-center">
            <span>{selectedCategory || 'Выберите категорию'}</span> {/* Показываем выбранную категорию */}
            <HiChevronDown
              className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''} text-gray-400 w-5 h-5`} />
          </div>
        </div>
        {isOpen && (
          <div className="absolute w-full mt-2 border border-gray-300 rounded-lg bg-white shadow-lg z-1000">
            <div className="max-h-48 overflow-auto bg-white">
              {categories.map((category, index) => (
                <div key={index}
                     className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                     onClick={() => handleCategorySelect(category)}>
                  {category}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
    </div>
  );
};
