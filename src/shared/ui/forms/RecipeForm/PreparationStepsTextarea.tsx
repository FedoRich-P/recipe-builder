import { FieldError, UseFormRegister } from "react-hook-form";
import { RecipeFormData } from '@/entities/recipe/model/types/recipe';

type Props = {
  register: UseFormRegister<RecipeFormData>;
  name: keyof RecipeFormData;
  error?: FieldError;
};

export const PreparationStepsTextarea = ({ register, name = "stepsString", error }: Props) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Шаги приготовления
    </label>
    <textarea
      {...register(name, { required: "Добавьте шаги приготовления" })}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500 h-24"
      placeholder="Опишите шаги (каждый с новой строки)"
    />
    {error && (
      <p className="mt-1 text-sm text-red-500">{error.message}</p>
    )}
  </div>
);