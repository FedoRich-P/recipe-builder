import React, { useState } from 'react';
import { FieldArrayWithId, UseFieldArrayAppend, UseFieldArrayRemove, UseFormRegister } from 'react-hook-form';
import { RecipeFormData } from '@/features/recipe/model/types/recipe';
import { IngredientInputRow } from '@/shared/ui/forms/RecipeForm/IngredientInputRow';

type IngredientsInputProps = {
  fields: FieldArrayWithId<RecipeFormData, 'ingredients', 'id'>[];
  append: UseFieldArrayAppend<RecipeFormData, 'ingredients'>;
  remove: UseFieldArrayRemove;
  register: UseFormRegister<RecipeFormData>;
  allSuggestions: string[];
};

export const IngredientsInput = (props: IngredientsInputProps) => {
  const {
    fields,
    append,
    remove,
    register,
    allSuggestions,
  } = props;
  const [inputValues, setInputValues] = useState<string[]>(fields.map(() => ''));
  const [showSuggestions, setShowSuggestions] = useState<boolean[]>(fields.map(() => false));

  const handleInputChange = (value: string, index: number) => {
    const updated = [...inputValues];
    updated[index] = value;
    setInputValues(updated);
  };

  const handleRemove = (index: number) => {
    remove(index);
    setInputValues((prev) => prev.filter((_, i) => i !== index));
    setShowSuggestions((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">Ингредиенты</label>
      <div className="space-y-2">
        {fields.map((field, index) => (
          <IngredientInputRow key={field.id}
                              index={index}
                              field={field}
                              register={register}
                              value={inputValues[index] || ''}
                              onChange={(val) => handleInputChange(val, index)}
                              onRemove={() => handleRemove(index)}
                              allSuggestions={allSuggestions}
                              showSuggestions={showSuggestions[index]}
                              setShowSuggestions={(v) => {
                                const updated = [...showSuggestions];
                                updated[index] = v;
                                setShowSuggestions(updated);
                              }} />))}
      </div>

      <button type="button"
              onClick={() => {
                append({ name: '', amount: '' });
                setInputValues((prev) => [...prev, '']);
                setShowSuggestions((prev) => [...prev, false]);
              }}
              className="mt-3 text-blue-600 hover:text-blue-800 transition text-sm">
        + Добавить ингредиент
      </button>
    </div>
  );
};
