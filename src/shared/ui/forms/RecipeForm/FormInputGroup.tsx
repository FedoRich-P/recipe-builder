import { UseFormRegister, FieldError } from 'react-hook-form';
import { RecipeFormData } from './RecipeForm';

type FormInputGroupProps = {
  register: UseFormRegister<RecipeFormData>;
  errors: {
    cookingTime?: FieldError;
    calories?: FieldError;
  };
}

export const FormInputGroup = ({ register, errors }: FormInputGroupProps) => {
  return (
    <div className="grid grid-cols-2 gap-4 mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Время приготовления:
          <input
            {...register('cookingTime', { required: 'Обязательное поле' })}
            placeholder="Например: 30 мин"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>
        {errors.cookingTime && (
          <p className="text-red-500 text-xs mt-1">{errors.cookingTime.message}</p>
        )}

        <label className="block text-sm font-medium text-gray-700 mb-2">
          Калорийность:
          <input
            {...register('calories', {
              pattern: {
                value: /^\d+ ккал$/,
                message: 'Формат: число ккал (например: 250 ккал)',
              },
            })}
            placeholder="Например: 250 ккал"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>
        {errors.calories && (
          <p className="text-red-500 text-xs mt-1">{errors.calories.message}</p>
        )}
    </div>
  );
};