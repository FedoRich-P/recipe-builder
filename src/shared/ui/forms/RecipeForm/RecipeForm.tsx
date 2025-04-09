import { useForm, useFieldArray } from 'react-hook-form';
import { RecipeNameInput } from './RecipeNameInput';
import { IngredientsInput } from './IngredientsInput';
import { PreparationStepsTextarea } from './PreparationStepsTextarea';
import { useState } from 'react';
import { RecipeToast } from './RecipeToast';
import { createPortal } from 'react-dom';

export type RecipeFormData = {
  name: string
  ingredients: { value: string }[]
  steps: string
}

type RecipeFormProps = {
  initialValues?: RecipeFormData
  onCancel: () => void
  onSubmit?: (data: RecipeFormData) => void
  title?: string
  buttonText?: string
}

export const RecipeForm = (props: RecipeFormProps) => {
  const { initialValues, onCancel, title = 'Добавить рецепт', buttonText, onSubmit } = props;

  const [showToast, setShowToast] = useState(false);
  const [addedRecipeName, setAddedRecipeName] = useState('');

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
    if(onSubmit) onSubmit(data);
    setAddedRecipeName(data.name);
    setShowToast(true);
    reset();
  };

  const handleToastClose = () => {
    setShowToast(false);
  };

  const handleCancel = () => {
    reset();
    onCancel();
  };

  return (
    <>
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
                  onClick={handleCancel}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300">
            Закрыть форму
          </button>
          <button type="submit"
                  className="px-4 py-2 text-white bg-orange-500 rounded-lg hover:bg-orange-600 disabled:opacity-50">
            {buttonText}
          </button>
        </div>
      </form>
      {showToast && createPortal(
        <RecipeToast recipeName={addedRecipeName}
                     onClose={handleToastClose} />,
        document.body,
      )}
    </>
  );
};