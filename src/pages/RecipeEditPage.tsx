import { useParams, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "@app/hooks";
import { selectAllRecipes, updateRecipe } from "@/features/recipe/recipeSlice";
import { RecipeForm, RecipeFormData } from '@/components/forms/RecipeForm';
import { SubmitButton } from "@components/forms/SubmitButton";

export const RecipeEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const recipes = useAppSelector(selectAllRecipes);
  const recipe = recipes.find((r) => r.id === id);

  if (!recipe) {
    return <div className="text-red-500 p-4">Рецепт не найден</div>;
  }

  // Преобразуем steps (массив строк) в одну строку
  const initialValues: RecipeFormData = {
    name: recipe.name,
    ingredients: recipe.ingredients.map((ing) => ({ value: ing })),
    steps: recipe.steps.join("\n"),
  };

  const handleUpdate = (data: RecipeFormData) => {
    const updatedSteps = data.steps.split("\n").map((step) => step.trim());

    const updatedRecipe = {
      ...recipe,
      name: data.name,
      ingredients: data.ingredients.map((ingredient) => ingredient.value),
      steps: updatedSteps,
    };

    dispatch(updateRecipe(updatedRecipe));
    navigate(`/`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 flex items-center justify-center py-10">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl">
        <div className="mb-6">
          <SubmitButton
            text="Назад"
            onClick={() => navigate(`/`)}
            className="bg-gray-700 text-white hover:bg-gray-600 px-4 py-2 rounded-md"
          />
        </div>
        <RecipeForm
          initialValues={initialValues}
          onSubmit={handleUpdate}
          title="Редактировать рецепт"
          buttonText="Сохранить изменения"
        />
      </div>
    </div>
  );
};
