import { Control, FieldErrors, FieldArrayWithId, UseFormRegister, UseFieldArrayAppend, UseFieldArrayRemove, useWatch } from "react-hook-form";
import { RecipeFormData } from '@/shared/ui/forms/RecipeForm/RecipeForm';
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useIngredientSuggestions } from '@/features/ingredients-filter/lib/useIngredientSuggestions';  // ваш хук для подсказок

type Props = {
  register: UseFormRegister<RecipeFormData>;
  control: Control<RecipeFormData>;
  errors: FieldErrors<RecipeFormData>;
  fields: FieldArrayWithId<RecipeFormData, "ingredients", "id">[];
  append: UseFieldArrayAppend<RecipeFormData, "ingredients">;
  remove: UseFieldArrayRemove;
};

export const IngredientsInput = (props: Props) => {

  const { register, fields, append, remove, errors, control } = props;
  // Следим за значениями ингредиентов
  const ingredientValues = useWatch({
    control,
    name: 'ingredients'
  });

  // Получаем последний введённый ингредиент
  const lastValue = ingredientValues?.[ingredientValues.length - 1]?.value || '';

  // Хук для подсказок на основе последнего введённого значения
  const suggestions = useIngredientSuggestions(lastValue);

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">Ингредиенты</label>

      {fields.map((field, index) => (
        <div key={field.id} className="flex items-center gap-2 mb-2 relative">
          <div className="relative w-full">
            <input
              {...register(`ingredients.${index}.value` as const, { required: true })}
              placeholder={`Ингредиент ${index + 1}`}
              className="pl-3 pr-3 py-2 border border-gray-300 rounded-md w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <span
              onClick={() => remove(index)}  // Удаление ингредиента
              className="absolute right-2 top-2.5 text-gray-400 cursor-pointer"
              title="Удалить ингредиент">
              <TrashIcon className="w-4 h-4" />
            </span>
          </div>

          {index === fields.length - 1 && suggestions.length > 0 && (
            <ul className="border bg-white rounded mt-2 shadow text-sm absolute w-full z-10 top-full left-0">
              {suggestions.map((item) => (
                <li
                  key={item}
                  onClick={() => {
                    append({ value: item });  // При клике на подсказку, добавляем новый ингредиент
                  }}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                >
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}

      <button
        type="button"
        onClick={() => append({ value: '' })}
        className="mt-2 inline-flex items-center text-sm text-blue-600 hover:underline">
        <PlusIcon className="w-4 h-4 mr-1" />
        Добавить ингредиент
      </button>

      {errors.ingredients && (
        <p className="text-xs text-red-500 mt-1">Заполните все поля ингредиентов</p>
      )}
    </div>
  );
};
