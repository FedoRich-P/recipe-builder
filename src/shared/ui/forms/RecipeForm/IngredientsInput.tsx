import {
  Control,
  FieldErrors,
  FieldArrayWithId,
  UseFormRegister,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
  useWatch,
} from 'react-hook-form';
import { RecipeFormData } from '@/shared/ui/forms/RecipeForm/RecipeForm';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useEffect, useMemo, useRef } from 'react';
import { useGetRecipesQuery } from '@/features/recipe/model/recipesApi';
import { getOrderedIngredients } from '@/shared/lib/utils/getOrderedIngredients';

type Props = {
  register: UseFormRegister<RecipeFormData>;
  control: Control<RecipeFormData>;
  errors: FieldErrors<RecipeFormData>;
  fields: FieldArrayWithId<RecipeFormData, 'ingredients', 'id'>[];
  append: UseFieldArrayAppend<RecipeFormData, 'ingredients'>;
  remove: UseFieldArrayRemove;
};

export const IngredientsInput = (props: Props) => {
  const { register, fields, append, remove, errors, control } = props;
  const { data: allRecipes } = useGetRecipesQuery();

  // Формируем список всех уникальных ингредиентов из рецептов
  const allIngredients = useMemo(() => {
    return getOrderedIngredients(allRecipes, []);
  }, [allRecipes]);

  // Реф для контроля добавления новых полей
  const appendedRef = useRef(false);

  // Следим за текущими значениями полей ингредиентов
  const ingredientValues = useWatch({
    control,
    name: 'ingredients',
  });

  // Получаем значение последнего ингредиента в списке
  const lastValue = ingredientValues?.[ingredientValues.length - 1]?.value || '';

  // Формируем подсказки для автодополнения
  const suggestions = useMemo(() => {
    // Собираем уже использованные ингредиенты
    const usedIngredients = new Set(ingredientValues.map(i => i.value.trim()));

    return allIngredients
      .filter(ing =>
        // Фильтруем по совпадению введенного текста
        ing.toLowerCase().includes(lastValue.toLowerCase()) &&
        // Исключаем уже добавленные ингредиенты
        !usedIngredients.has(ing),
      )
      .slice(0, 5); // Ограничиваем 5 подсказками
  }, [allIngredients, lastValue, ingredientValues]);

  // Эффект для автоматического добавления новых полей
  useEffect(() => {
    // Если нет полей - добавляем первое пустое
    if (fields.length === 0) {
      append({ value: '' });
      appendedRef.current = true;
      return;
    }

    const lastField = fields[fields.length - 1];

    // Если последнее поле заполнено и флаг не установлен
    if (lastField && lastField.value.trim() !== '' && !appendedRef.current) {
      append({ value: '' }); // Добавляем новое пустое поле
      appendedRef.current = true; // Ставим флаг
    } else if (lastField && lastField.value.trim() === '') {
      // Если поле пустое - сбрасываем флаг
      appendedRef.current = false;
    }
  }, [fields, fields.length, append]);

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Ингредиенты
      </label>
      {fields.map((field, index) => (
        <div key={field.id} className="flex flex-col mb-2 relative">
          <div className="relative">
            {/* Поле ввода ингредиента */}
            <input{...register(`ingredients.${index}.value`)}
                  placeholder={`Ингредиент ${index + 1}`}
                  className="pl-3 pr-3 py-2 border border-gray-300 rounded-md w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            {fields.length > 1 && (
              <span onClick={() => remove(index)}
                    className="absolute right-2 top-2.5 text-gray-400 cursor-pointer"
                    title="Удалить ингредиент">
                <TrashIcon className="w-4 h-4" />
              </span>
            )}
          </div>
          {index === fields.length - 1 &&
            lastValue.trim() !== '' &&
            suggestions.length > 0 && (
              <ul className="border bg-white rounded mt-2 shadow text-sm absolute w-full z-10 top-full left-0">
                {suggestions.map((item) => (
                  <li key={item}
                      onClick={() => append({ value: item })}
                      className="p-2 hover:bg-gray-100 cursor-pointer">
                    {item}
                  </li>
                ))}
              </ul>
            )}
        </div>
      ))}
      <button type="button"
              onClick={() => append({ value: '' })}
              className="inline-flex items-center text-sm text-blue-600 hover:underline">
        Добавить ингредиент
        <PlusIcon className="w-4 h-4 mr-1" />
      </button>
      {errors.ingredients && (
        <p className="text-xs text-red-500 mt-1">Заполните все поля ингредиентов</p>
      )}
    </div>
  );
};