import {
    Control,
    FieldErrors,
    FieldArrayWithId,
    UseFormRegister,
    UseFieldArrayAppend,
    UseFieldArrayRemove
} from "react-hook-form";
import {FormData} from "@/components/forms/RecipeForm";
import {PlusIcon, TrashIcon} from "@heroicons/react/24/outline";

type Props = {
    register: UseFormRegister<FormData>;
    control: Control<FormData>;
    errors: FieldErrors<FormData>;
    fields: FieldArrayWithId<FormData, "ingredients", "id">[];
    append: UseFieldArrayAppend<FormData, "ingredients">;
    remove: UseFieldArrayRemove;
};

export const IngredientsInputList = ({register, fields, append, remove, errors}: Props) => {
    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Ингредиенты</label>

            {fields.length === 0 && (
                <div className="flex items-center gap-2 mb-2">
                    <div className="relative w-full">
                        <input
                            {...register("ingredients.0.value", {required: "Добавьте хотя бы один ингредиент"})}
                            placeholder="Ингредиент 1"
                            className="pl-8 pr-3 py-2 border border-gray-300 rounded-md w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="absolute left-2 top-2.5 text-gray-400">
            </span>
                    </div>
                </div>
            )}

            {fields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2 mb-2">
                    <div className="relative w-full">
                        <input
                            {...register(`ingredients.${index}.value` as const, {required: true})}
                            placeholder={`Ингредиент ${index + 1}`}
                            className="pl-3 pr-3 py-2 border border-gray-300 rounded-md w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <span onClick={() => remove(index)}
                              className="absolute right-2 top-2.5 text-gray-400 cursor-pointer"
                              title="Удалить ингредиент"
                        >
              <TrashIcon className="w-4 h-4"/>
            </span>
                    </div>
                </div>
            ))}

            <button type="button"
                    onClick={() => append({value: ""})}
                    className="mt-2 inline-flex items-center text-sm text-blue-600 hover:underline">
                <PlusIcon className="w-4 h-4 mr-1"/>
                Добавить ингредиент
            </button>

            {errors.ingredients && (
                <p className="text-xs text-red-500 mt-1">Заполните все поля ингредиентов</p>
            )}
        </div>
    );
};
