import { PlusIcon } from '@heroicons/react/24/outline';
import { RecipeItem } from '@/entities/recipe/ui/RecipeItem';
import { useState } from 'react';
import { RecipeForm } from '@/features/recipe-form/ui/RecipeForm';
import { Recipe, RecipeFormData } from '@/entities/recipe/model/types/recipe';
import { useUpdateRecipeMutation } from '@/entities/recipe/api/recipesApi';
import { createFileList } from '@/shared/lib/utils/createFileList';

interface Props {
  recipe: Recipe;
}

export const RecipeDetails = ({ recipe }: Props) => {
  const [showForm, setShowForm] = useState(false);
  const [updateRecipe] = useUpdateRecipeMutation();

  const initialValues: RecipeFormData = {
    ...recipe,
    stepsString: recipe.steps.join('\n'),
    image: recipe.imageUrl ? createFileList([new File([recipe.imageUrl], 'image.jpg')]) : null,
  };

  const handleSubmit = async (data: RecipeFormData) => {
    try {
      await updateRecipe({
        id: recipe.id,
        data: {
          name: data.name,
          ingredients: data.ingredients,
          steps: data.stepsString.split('\n').map((s) => s.trim()),
        },
      }).unwrap();
      setShowForm(false);
    } catch (err) {
      console.error('Ошибка при обновлении рецепта:', err);
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center">
      <div className="w-full max-w-3xl bg-white/90 rounded-2xl shadow-xl p-6 backdrop-blur-md">
        <RecipeItem recipe={recipe} isFavorite={recipe.favorite} isMainPage className="min-h-[40vh] block" />
        <div className="mt-6">
          {!showForm ? (
            <div className="flex flex-col items-center gap-4">
              <button onClick={() => setShowForm(true)}
                      className="w-full max-w-md px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-base font-semibold shadow-md transition-all flex items-center justify-center gap-2">
                <PlusIcon className="w-5 h-5" />
                Редактировать рецепт
              </button>
            </div>
          ) : (
            <div className="mt-6">
              <RecipeForm key={recipe.id}
                          initialValues={initialValues}
                          onSubmit={handleSubmit}
                          onCancel={() => setShowForm(false)}
                          title="Редактировать рецепт"
                          buttonText="Сохранить изменения"
                          className="bg-white rounded-xl shadow-lg p-6" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
