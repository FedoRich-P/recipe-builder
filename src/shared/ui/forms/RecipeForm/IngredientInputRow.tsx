import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useAutocompleteSuggestions } from '@/shared/lib/hooks/useAutocompleteSuggestions';
import { UseFormRegister, FieldArrayWithId } from 'react-hook-form';
import { RecipeFormData } from '@/features/recipe/model/types/recipe';

type IngredientInputRowProps = {
  index: number;
  field: FieldArrayWithId<RecipeFormData, 'ingredients', 'id'>;
  register: UseFormRegister<RecipeFormData>;
  value: string;
  onChange: (v: string) => void;
  onRemove: () => void;
  allSuggestions: string[];
  showSuggestions: boolean;
  setShowSuggestions: (v: boolean) => void;
};

export const IngredientInputRow = (props: IngredientInputRowProps) => {
  const {
    index,
    register,
    value,
    onChange,
    onRemove,
    allSuggestions,
    showSuggestions,
    setShowSuggestions,
  } = props;

  const { filteredSuggestions } = useAutocompleteSuggestions<string>({
    inputValue: value,
    allSuggestions,
    maxResults: 5,
  });

  return (
    <div className="flex flex-col gap-1 relative">
      <div className="flex items-center gap-2 relative">
        <div className="relative w-[70%]">
          <input{...register(`ingredients.${index}.name` as const)}
                value={value}
                onChange={(e) => {
                  onChange(e.target.value);
                  setShowSuggestions(true);
                }}
                placeholder="Название"
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8" />

          {value && (
            <button type="button"
                    onClick={() => {
                      onChange('');
                      setShowSuggestions(false);
                    }}
                    className="absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 transition"
                    title="Очистить">
              <XMarkIcon className="w-5 h-5" />
            </button>
          )}
        </div>

        <input{...register(`ingredients.${index}.amount` as const)}
              placeholder="Кол-во"
              className="w-[25%] border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <button type="button"
                onClick={onRemove}
                className="w-[5%] text-red-500 hover:text-red-600 transition"
                title="Удалить">
          <XMarkIcon className="w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors" />
        </button>
      </div>

      {showSuggestions && filteredSuggestions.length > 0 && (
        <ul className="absolute top-full z-10 bg-white border rounded shadow w-[70%] mt-1 max-h-40 overflow-y-auto">
          {filteredSuggestions.map((suggestion, i) => (
            <li key={i}
                onMouseDown={() => {
                  onChange(suggestion);
                  setShowSuggestions(false);
                }}
                className="px-3 py-2 hover:bg-orange-100 cursor-pointer text-sm">
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
