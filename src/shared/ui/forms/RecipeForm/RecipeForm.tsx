import { useForm, useFieldArray } from 'react-hook-form';
import { RecipeNameInput } from '@/shared/ui/forms/RecipeForm/RecipeNameInput';
import { IngredientsInput } from '@/shared/ui/forms/RecipeForm/IngredientsInput';
import { PreparationStepsTextarea } from '@/shared/ui/forms/RecipeForm/PreparationStepsTextarea';

export type RecipeFormData = {
  name: string;
  ingredients: { value: string }[];
  steps: string;
};

type RecipeFormProps = {
  initialValues?: RecipeFormData;
  onSubmit: (data: RecipeFormData) => void;
  onCancel: () => void;
  title?: string;
  buttonText?: string;
};

export const RecipeForm = (props: RecipeFormProps) => {
  const { initialValues, onSubmit, onCancel, title = 'Добавить рецепт', buttonText = 'Сохранить' } = props;
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<RecipeFormData>({
    defaultValues: initialValues || {
      name: '',
      ingredients: [{ value: '' }],
      steps: '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'ingredients',
  });

  const handleFormSubmit = (data: RecipeFormData) => {
    onSubmit(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
      <h3 className="font-medium text-gray-700 mb-3">{title}</h3>

      <RecipeNameInput register={register} error={errors.name} />

      <IngredientsInput fields={fields}
                        append={append}
                        remove={remove}
                        register={register}
                        control={control}
                        errors={errors} />

      <PreparationStepsTextarea register={register} error={errors.steps} />

      <div className="flex justify-end gap-2 mt-4">
        <button type="button"
                onClick={onCancel}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300">
          Отмена
        </button>
        <button type="submit"
                className="px-4 py-2 text-white bg-orange-500 rounded-lg hover:bg-orange-600">
          {buttonText}
        </button>
      </div>
    </form>
  );
};