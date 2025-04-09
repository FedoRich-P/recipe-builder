import { useParams, useNavigate } from 'react-router-dom';
import { selectAllRecipes, updateRecipe } from '@/features/recipe/model/recipeSlice';
import { RecipeForm, RecipeFormData } from '@/shared/ui/forms/RecipeForm/RecipeForm';
import { useAppDispatch, useAppSelector } from '@/app/hooks';

export const EditPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const recipes = useAppSelector(selectAllRecipes);
  const recipe = recipes.find((r) => r.id === id);

  if (!recipe) {
    return <div className="text-red-500 p-4">Рецепт не найден</div>;
  }

  const initialValues: RecipeFormData = {
    name: recipe.name,
    ingredients: recipe.ingredients.map((ing) => ({ value: ing })),
    steps: recipe.steps.join('\n'),
  };

  const handleSubmit = (data: RecipeFormData) => {
    const updatedRecipe = {
      ...recipe,
      name: data.name,
      ingredients: data.ingredients.map((ing) => ing.value),
      steps: data.steps.split('\n').map((step) => step.trim()),
    };
    dispatch(updateRecipe(updatedRecipe));
    navigate('/');
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center py-10">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl">
        <RecipeForm key={id}
                    initialValues={initialValues}
                    onSubmit={handleSubmit}
                    onCancel={() => navigate('/')}
                    title="Редактировать рецепт"
                    buttonText="Сохранить изменения" />
      </div>
    </div>
  );
};