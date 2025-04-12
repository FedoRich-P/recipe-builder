import { useForm, useFieldArray } from 'react-hook-form';
import { RecipeNameInput } from './RecipeNameInput';
import { IngredientsInput } from './IngredientsInput';
import { PreparationStepsTextarea } from './PreparationStepsTextarea';
import { useState } from 'react';
import { RecipeToast } from './RecipeToast';
import { createPortal } from 'react-dom';
import { FormInputGroup } from '@/shared/ui/forms/RecipeForm/FormInputGroup';
import { FormButtonGroup } from '@/shared/ui/forms/RecipeForm/FormBottonGroup';

export type RecipeFormData = {
  name: string
  ingredients: { value: string }[]
  steps: string
  cookingTime?: string;
  calories?: string;
}

type RecipeFormProps = {
  initialValues?: RecipeFormData
  onCancel: () => void
  onSubmit?: (data: RecipeFormData) => void
  title?: string
  buttonText?: string
  className?: string
}

export const RecipeForm = (props: RecipeFormProps) => {
  const { initialValues, onCancel, title = 'Добавить рецепт', buttonText, onSubmit, className } = props;

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
      cookingTime: '',
      calories: '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'ingredients',
  });

  const handleFormSubmit = (data: RecipeFormData) => {
    if (onSubmit) onSubmit(data);
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
      <form onSubmit={handleSubmit(handleFormSubmit)} className={` p-4 rounded-lg border border-gray-200 ${className}`}>
        <h3 className="font-medium text-gray-700 mb-3">{title}</h3>
        <RecipeNameInput register={register} error={errors.name} />
        <IngredientsInput fields={fields}
                          append={append}
                          remove={remove}
                          register={register}
                          control={control}
                          errors={errors} />
        <FormInputGroup register={register}
                        errors={errors} />
        <PreparationStepsTextarea register={register} error={errors.steps} />
        <FormButtonGroup  onCancel={handleCancel}
                          submitButtonText={buttonText} />
      </form>
      {showToast && createPortal(
        <RecipeToast recipeName={addedRecipeName}
                     onClose={handleToastClose} />,
        document.body,
      )}
    </>
  );
};