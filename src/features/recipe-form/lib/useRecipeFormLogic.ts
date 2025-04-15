import { useForm, useFieldArray } from 'react-hook-form';
import { useState } from 'react';
import { useCreateRecipeMutation, useGetRecipesQuery } from '@/entities/recipe/api/recipesApi';
import { Recipe, RecipeFormData } from '@/entities/recipe/model/types/recipe';

export const useRecipeFormLogic = (initialValues?: RecipeFormData, onSubmit?: (data: RecipeFormData) => void) => {
  const [createRecipe, { isLoading }] = useCreateRecipeMutation();
  const [showToast, setShowToast] = useState(false);
  const [addedRecipeName, setAddedRecipeName] = useState('');
  const { data: recipes = [], isLoading: recipesLoading, error } = useGetRecipesQuery();

  const categories = [...new Set(recipes.map((r) => r.category).filter(Boolean))];

  const allIngredients = Array.from(
    new Set(
      recipes.flatMap((recipe) =>
        (recipe.ingredients || []).map((ing) => ing?.name?.trim()).filter(Boolean),
      ),
    ),
  ).filter(Boolean);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<RecipeFormData>({
    defaultValues: initialValues || {
      name: '',
      ingredients: [{ name: '', amount: '' }],
      stepsString: '',
      cookingTime: '',
      calories: '',
      category: '',
      image: null,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'ingredients',
  });

  const handleFormSubmit = async (data: RecipeFormData) => {
    const steps = data.stepsString
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    if (steps.length === 0) {
      alert('Добавьте шаги приготовления');
      return;
    }

    const imageUrl = data.image?.[0] ? URL.createObjectURL(data.image[0]) : '';

    const recipeToSend: Recipe = {
      id: crypto.randomUUID(),
      name: data.name,
      ingredients: data.ingredients,
      steps,
      cookingTime: Number(data.cookingTime || 0),
      calories: Number(data.calories || 0),
      favorite: false,
      imageUrl,
      category: data.category,
    };

    try {
      await createRecipe(recipeToSend).unwrap();
      setAddedRecipeName(data.name);
      setShowToast(true);
      reset();
      onSubmit?.(data);
    } catch (err) {
      console.error('Ошибка при сохранении рецепта', err);
    }

    if (imageUrl) {
      setTimeout(() => URL.revokeObjectURL(imageUrl), 0);
    }
  };

  return {
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
    categoryOptions: categories.map((c) => ({ value: c, label: c })),
    allIngredients,
  };
};
