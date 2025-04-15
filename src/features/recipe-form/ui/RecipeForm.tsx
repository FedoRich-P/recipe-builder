import { createPortal } from 'react-dom';
import { ImageUpload } from '@/shared/ui/ImageUpload';
import { FormButtonGroup } from '@/shared/ui/forms/RecipeForm/FormBottonGroup';
import { CustomSelect } from '@/shared/ui/CustomSelect';
import { Controller } from 'react-hook-form';
import { RecipeNameInput } from '@/shared/ui/forms/RecipeForm/RecipeNameInput';
import { IngredientsInput } from '@/shared/ui/forms/RecipeForm/IngredientsInput';
import { FormInputGroup } from '@/shared/ui/forms/RecipeForm/FormInputGroup';
import { PreparationStepsTextarea } from '@/shared/ui/forms/RecipeForm/PreparationStepsTextarea';
import { RecipeToast } from '@/shared/ui/forms/RecipeForm/RecipeToast';
import { RecipeFormData } from '@/entities/recipe/model/types/recipe';
import { useRecipeFormLogic } from '@/features/recipe-form/lib/useRecipeFormLogic';

type RecipeFormProps = {
  initialValues?: RecipeFormData;
  onCancel: () => void;
  onSubmit?: (data: RecipeFormData) => void;
  title?: string;
  buttonText?: string;
  className?: string;
};

export const RecipeForm = (props: RecipeFormProps) => {
  const {
    initialValues,
    onCancel,
    onSubmit,
    title = 'Добавить рецепт',
    buttonText = 'Сохранить',
    className,
  } = props;

  const {
    register,
    handleSubmit,
    control,
    errors,
    fields,
    append,
    remove,
    handleFormSubmit,
    reset,
    showToast,
    setShowToast,
    addedRecipeName,
    isLoading,
    recipesLoading,
    error,
    categoryOptions,
    allIngredients,
  } = useRecipeFormLogic(initialValues, onSubmit);

  const handleCancel = () => {
    reset();
    onCancel();
  };

  if (recipesLoading) return <p>Загрузка...</p>;
  if (error) return <p>Ошибка загрузки рецептов</p>;

  return (
    <>
      <form onSubmit={handleSubmit(handleFormSubmit)} className={`p-4 border rounded-md ${className}`}>
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
        <RecipeNameInput register={register} error={errors.name} />
        <IngredientsInput fields={fields} append={append} remove={remove} register={register}
                          allSuggestions={allIngredients} />
        <FormInputGroup register={register} />
        <Controller name="category"
                    control={control}
                    rules={{ required: 'Категория обязательна' }}
                    render={({ field, fieldState }) => (
                      <CustomSelect
                        label="Категория"
                        value={field.value}
                        onSelect={field.onChange}
                        options={categoryOptions}
                        error={fieldState.error?.message} />)} />
        <ImageUpload register={register} error={errors.image} />
        <PreparationStepsTextarea register={register} name="stepsString" error={errors.stepsString} />
        <FormButtonGroup onCancel={handleCancel} submitButtonText={buttonText} disabled={isLoading} />
      </form>
      {showToast &&
        createPortal(<RecipeToast recipeName={addedRecipeName} onClose={() => setShowToast(false)} />, document.body)}
    </>
  );
};

// import { useForm, useFieldArray, Controller } from 'react-hook-form';
// import { useState } from 'react';
// import { createPortal } from 'react-dom';
// import { useGetRecipesQuery, useCreateRecipeMutation } from '@/shared/api/recipesApi';
// import { RecipeNameInput } from '../../../shared/ui/forms/RecipeForm/RecipeNameInput';
// import { IngredientsInput } from '../../../shared/ui/forms/RecipeForm/IngredientsInput';
// import { FormInputGroup } from '../../../shared/ui/forms/RecipeForm/FormInputGroup';
// import { PreparationStepsTextarea } from '../../../shared/ui/forms/RecipeForm/PreparationStepsTextarea';
// import { RecipeToast } from '../../../shared/ui/forms/RecipeForm/RecipeToast';
// import { Recipe, RecipeFormData } from '@/entities/recipe/model/types/recipe';
// import { ImageUpload } from '@/shared/ui/ImageUpload';
// import { FormButtonGroup } from '@/shared/ui/forms/RecipeForm/FormBottonGroup';
// import { CustomSelect, Option } from '@/shared/ui/CustomSelect';
//
// type RecipeFormProps = {
//   initialValues?: RecipeFormData;
//   onCancel: () => void;
//   onSubmit?: (data: RecipeFormData) => void;
//   title?: string;
//   buttonText?: string;
//   className?: string;
// };
//
// export const RecipeForm = (props: RecipeFormProps) => {
//   const {
//     initialValues,
//     onCancel,
//     onSubmit,
//     title = 'Добавить рецепт',
//     buttonText = 'Сохранить',
//     className,
//   } = props;
//   const [createRecipe, { isLoading }] = useCreateRecipeMutation();
//   const [showToast, setShowToast] = useState(false);
//   const [addedRecipeName, setAddedRecipeName] = useState('');
//
//   const { data: recipes = [], isLoading: recipesLoading, error } = useGetRecipesQuery();
//   const categories = [...new Set(recipes.map((r) => r.category).filter(Boolean))];
//
//   const {
//     register,
//     handleSubmit,
//     control,
//     formState: { errors },
//     reset,
//   } = useForm<RecipeFormData>({
//     defaultValues: initialValues || {
//       name: '',
//       ingredients: [{ name: '', amount: '' }],
//       stepsString: '',
//       cookingTime: '',
//       calories: '',
//       category: '',
//       image: null,
//     },
//   });
//
//   const { fields, append, remove } = useFieldArray({
//     control,
//     name: 'ingredients',
//   });
//
//   const handleFormSubmit = async (data: RecipeFormData) => {
//     const steps = data.stepsString
//       .split('\n')
//       .map((s) => s.trim())
//       .filter(Boolean);
//
//     if (steps.length === 0) {
//       alert('Добавьте шаги приготовления');
//       return;
//     }
//
//     const imageUrl = data.image?.[0] ? URL.createObjectURL(data.image[0]) : '';
//
//     const recipeToSend: Recipe = {
//       id: crypto.randomUUID(),
//       name: data.name,
//       ingredients: data.ingredients,
//       steps,
//       cookingTime: Number(data.cookingTime || 0),
//       calories: Number(data.calories || 0),
//       favorite: false,
//       imageUrl,
//       category: data.category,
//     };
//
//     try {
//       await createRecipe(recipeToSend).unwrap();
//       setAddedRecipeName(data.name);
//       setShowToast(true);
//       reset();
//       onSubmit?.(data);
//     } catch (err) {
//       console.error('Ошибка при сохранении рецепта', err);
//     }
//
//     if (imageUrl) {
//       setTimeout(() => URL.revokeObjectURL(imageUrl), 0);
//     }
//   };
//
//   const handleCancel = () => {
//     reset();
//     onCancel();
//   };
//
//   const allIngredients = Array.from(
//     new Set(
//       recipes
//         .flatMap((recipe) =>
//           (recipe.ingredients || []).map((ing) => ing?.name?.trim()).filter(Boolean),
//         ),
//     ),
//   ).filter(Boolean);
//
//   const categoryOptions: Option<string>[] = categories.map((c) => ({
//     value: c,
//     label: c,
//   }));
//
//   if (recipesLoading) return <p>Загрузка...</p>;
//   if (error) return <p>Ошибка загрузки рецептов</p>;
//
//   return (
//     <>
//       <form onSubmit={handleSubmit(handleFormSubmit)} className={`p-4 border rounded-md ${className}`}>
//         <h2 className="text-lg font-semibold mb-4">{title}</h2>
//         <RecipeNameInput register={register} error={errors.name} />
//         <IngredientsInput fields={fields}
//                           append={append}
//                           remove={remove}
//                           register={register}
//                           allSuggestions={allIngredients} />
//         <FormInputGroup register={register} />
//         <Controller name="category"
//                     control={control}
//                     rules={{ required: 'Категория обязательна' }}
//                     render={({ field, fieldState }) => (
//                       <CustomSelect
//                         label="Категория"
//                         value={field.value}
//                         onSelect={field.onChange}
//                         options={categoryOptions}
//                         error={fieldState.error?.message} />)} />
//         <ImageUpload register={register} error={errors.image} />
//         <PreparationStepsTextarea register={register} name="stepsString" error={errors.stepsString} />
//         <FormButtonGroup onCancel={handleCancel} submitButtonText={buttonText} disabled={isLoading} />
//       </form>
//       {showToast &&
//         createPortal(<RecipeToast recipeName={addedRecipeName} onClose={() => setShowToast(false)} />, document.body)}
//     </>
//   );
// };
