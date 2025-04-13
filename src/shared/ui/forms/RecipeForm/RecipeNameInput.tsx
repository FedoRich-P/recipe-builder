import {FieldError, UseFormRegister} from "react-hook-form";
import { RecipeFormData } from '@/features/recipe/model/types/recipe';

type Props = {
    register: UseFormRegister<RecipeFormData>;
    error?: FieldError;
};

export const RecipeNameInput = ({register, error}: Props) => (
    <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
            Название рецепта
        </label>
        <input
            {...register("name", {required: "Обязательное поле"})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
            placeholder="Введите название"/>
        {error && (
            <p className="mt-1 text-sm text-red-500">{error.message}</p>
        )}
    </div>
);
